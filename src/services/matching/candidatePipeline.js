import mongoose from 'mongoose';

/**
 * Builds an optimized MongoDB Aggregation Pipeline for Candidate Retrieval.
 * Performs indexed hard filtering, lightweight relevance scoring, and lean field projection.
 */
export function buildCandidateAggregationPipeline({
  currentUser,
  filters = {},
  excludedIds = [],
  boundedPoolSize = 100,
  skip = 0
}) {
  const currentUserId = currentUser?._id || currentUser?.id || null;

  // 1. Hard Eligibility Filters ($match)
  const matchStage = {
    isDeleted: { $ne: true },
    status: { $ne: 'Deleted' }
  };

  // Ensure current user is excluded
  const objectExcludedIds = [];
  if (currentUserId) {
    if (mongoose.Types.ObjectId.isValid(currentUserId)) {
      objectExcludedIds.push(new mongoose.Types.ObjectId(currentUserId.toString()));
    }
  }

  if (Array.isArray(excludedIds) && excludedIds.length > 0) {
    for (const id of excludedIds) {
      if (id && mongoose.Types.ObjectId.isValid(id.toString())) {
        objectExcludedIds.push(new mongoose.Types.ObjectId(id.toString()));
      }
    }
  }

  if (objectExcludedIds.length > 0) {
    matchStage._id = { $nin: objectExcludedIds };
  }

  // Filter by opposite gender if known
  if (currentUser?.gender) {
    if (currentUser.gender === 'Male') matchStage.gender = 'Female';
    else if (currentUser.gender === 'Female') matchStage.gender = 'Male';
  }

  // Explicit filter options from client
  if (filters.caste) {
    matchStage.caste = new RegExp(filters.caste, 'i');
  }

  if (filters.isVerified === 'true' || filters.isVerified === true || filters.verified === 'true' || filters.verified === true) {
    matchStage.$or = [
      { isVerified: true },
      { verificationStatus: 'Verified' },
      { verified: true }
    ];
  }

  if (filters.location) {
    matchStage.$or = [
      { currentCity: new RegExp(filters.location, 'i') },
      { state: new RegExp(filters.location, 'i') }
    ];
  }

  // 2. Lightweight Relevance Scoring ($addFields)
  const expCaste = (currentUser?.expectedCaste || 'bari').trim().toLowerCase();
  const expCity = (currentUser?.preferredCity || currentUser?.currentCity || '').trim().toLowerCase();

  const addFieldsStage = {
    dbRelevanceScore: {
      $add: [
        // Caste affinity bonus (30 pts)
        {
          $cond: [
            {
              $or: [
                { $eq: [{ $toLower: { $ifNull: ['$caste', ''] } }, expCaste] },
                { $eq: [{ $toLower: { $ifNull: ['$caste', ''] } }, 'bari'] }
              ]
            },
            30,
            0
          ]
        },
        // City proximity bonus (25 pts)
        {
          $cond: [
            expCity
              ? { $eq: [{ $toLower: { $ifNull: ['$currentCity', ''] } }, expCity] }
              : false,
            25,
            0
          ]
        },
        // Verified Profile bonus (15 pts)
        {
          $cond: [
            {
              $or: [
                { $eq: ['$isVerified', true] },
                { $eq: ['$verificationStatus', 'Verified'] }
              ]
            },
            15,
            0
          ]
        },
        // Profile Photo bonus (15 pts)
        {
          $cond: [
            {
              $and: [
                { $ne: ['$profilePhoto', null] },
                { $ne: ['$profilePhoto', ''] }
              ]
            },
            15,
            0
          ]
        },
        // Profile completeness (up to 15 pts)
        {
          $multiply: [
            { $ifNull: ['$profileCompletion', 50] },
            0.15
          ]
        }
      ]
    }
  };

  // 3. Lean Projection (exclude sensitive and heavy fields)
  const projectStage = {
    password: 0,
    email: 0,
    __v: 0,
    verificationSelfieUrl: 0,
    verificationDocUrl: 0,
    verificationDocType: 0,
    verificationRejectReason: 0
  };

  // 4. Sort Stage
  const sortStage = filters.sort === 'newest'
    ? { createdAt: -1 }
    : { dbRelevanceScore: -1, createdAt: -1 };

  // Pipeline assembly
  const pipeline = [
    { $match: matchStage },
    { $addFields: addFieldsStage },
    { $project: projectStage },
    { $sort: sortStage }
  ];

  if (skip > 0) {
    pipeline.push({ $skip: skip });
  }

  pipeline.push({ $limit: Math.max(10, Math.min(boundedPoolSize, 300)) });

  return { pipeline, matchStage };
}
