import User from '../../models/User.js';
import { calculateMutualCompatibility } from './compatibilityScoring.js';
import { buildCandidateAggregationPipeline } from './candidatePipeline.js';
import { bucketSeededShuffle, decodeCursor, encodeCursor } from './pagination.js';

/**
 * High-Performance Matching Engine.
 * Combines MongoDB aggregation pipeline filtering with Node.js micro-batch mutual compatibility scoring.
 */
export async function getMatches({
  currentUserId = null,
  currentUser: providedUser = null,
  page = 1,
  limit: rawLimit = 20,
  cursor = null,
  filters = {}
}) {
  // 1. Fetch User Context if not passed directly
  let currentUser = providedUser;
  if (!currentUser && currentUserId) {
    currentUser = await User.findById(currentUserId)
      .select('-password -__v -verificationSelfieUrl -verificationDocUrl')
      .lean();
  }

  // 2. Determine Subscription Tier
  const isPaidUser = Boolean(
    currentUser?.isPremium ||
    (currentUser?.subscription?.isSubscribed && (!currentUser?.subscription?.expiresAt || new Date(currentUser.subscription.expiresAt) > new Date())) ||
    (currentUser?.subscription?.plan && String(currentUser.subscription.plan).toLowerCase() !== 'free') ||
    (currentUser?.subscription?.planName && String(currentUser.subscription.planName).toLowerCase() !== 'free')
  );

  // 3. Normalize Limit (Safety Boundary: 1 to 50)
  const defaultLimit = isPaidUser ? 30 : 20;
  const limit = Math.max(1, Math.min(parseInt(rawLimit, 10) || defaultLimit, 50));
  const minCompatibility = parseInt(filters.minScore || filters.minCompatibility, 10) || 0;

  // 4. Collect Excluded IDs
  const excludedIds = [];
  if (currentUser?.interestsSent && Array.isArray(currentUser.interestsSent)) {
    excludedIds.push(...currentUser.interestsSent.map(id => id.toString()));
  }
  if (currentUser?.passedUsers && Array.isArray(currentUser.passedUsers)) {
    excludedIds.push(...currentUser.passedUsers.map(id => id.toString()));
  }
  if (currentUser?.blockedUsers && Array.isArray(currentUser.blockedUsers)) {
    excludedIds.push(...currentUser.blockedUsers.map(id => id.toString()));
  }

  // 5. Bounded Candidate Window Strategy (K = 60 to 150)
  // Ensures Node.js only ever processes a small micro-batch of candidates
  const boundedPoolSize = Math.max(limit * 3, 60);
  const skip = (cursor || page <= 1) ? 0 : (page - 1) * limit;

  const { pipeline, matchStage } = buildCandidateAggregationPipeline({
    currentUser,
    filters,
    excludedIds,
    boundedPoolSize,
    skip
  });

  // 6. Execute Aggregation Pipeline
  const [candidates, totalCount] = await Promise.all([
    User.aggregate(pipeline).exec(),
    // Fast index-backed count
    User.countDocuments(matchStage).exec().catch(() => 0)
  ]);

  if (!candidates || candidates.length === 0) {
    return {
      success: true,
      data: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0,
        nextCursor: null,
        hasMore: false,
        isPaidUser,
        seed: null
      }
    };
  }

  // 7. Micro-Batch Two-Way Mutual Compatibility Scoring in Node.js
  let scoredCandidates = candidates.map(candidate => {
    let compatibility = 75;

    if (currentUser) {
      compatibility = calculateMutualCompatibility(currentUser, candidate);
    } else {
      compatibility = Math.min(95, Math.max(60, candidate.profileCompletion || 70));
    }

    return {
      ...candidate,
      compatibility,
      matchPercentage: compatibility
    };
  });

  // 8. Filter by Minimum Compatibility Threshold
  if (minCompatibility > 0) {
    scoredCandidates = scoredCandidates.filter(c => c.matchPercentage >= minCompatibility);
  }

  // 9. Deterministic Seeded Shuffling
  const todayStr = new Date().toISOString().split('T')[0];
  const userSeedId = currentUserId || 'guest';
  const sessionSeed = filters.seed ||
    (isPaidUser ? `${userSeedId}_${Date.now()}` : `${userSeedId}_${todayStr}`);

  scoredCandidates = bucketSeededShuffle(scoredCandidates, sessionSeed);

  // 10. Keyset / Cursor or Page Slicing
  let startIndex = 0;
  if (cursor) {
    const decoded = decodeCursor(cursor);
    const targetId = (decoded?.id || decoded?._id || cursor).toString();
    const cursorIndex = scoredCandidates.findIndex(c => (c._id || c.id).toString() === targetId);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }

  const paginatedCandidates = scoredCandidates.slice(startIndex, startIndex + limit);
  const lastCandidate = paginatedCandidates[paginatedCandidates.length - 1];
  const lastCandidateId = lastCandidate ? (lastCandidate._id || lastCandidate.id).toString() : null;

  const nextCursor = lastCandidateId
    ? encodeCursor({ id: lastCandidateId, ts: Date.now() })
    : null;

  const hasMore = (startIndex + paginatedCandidates.length < scoredCandidates.length) ||
                  (skip + paginatedCandidates.length < totalCount);

  return {
    success: true,
    data: paginatedCandidates,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      nextCursor,
      hasMore,
      isPaidUser,
      seed: sessionSeed
    }
  };
}
