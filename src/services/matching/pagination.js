// Seeded PRNG for deterministic or session-based shuffling
export function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(array, seedString) {
  if (!array || array.length <= 1) return [...(array || [])];
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = Math.imul(31, hash) + seedString.charCodeAt(i) | 0;
  }
  const random = mulberry32(hash);
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Encodes an opaque cursor string for keyset pagination.
 */
export function encodeCursor(payload) {
  try {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  } catch {
    return null;
  }
}

/**
 * Decodes an opaque cursor string into its original payload or raw ID.
 */
export function decodeCursor(cursorStr) {
  if (!cursorStr) return null;
  try {
    const decoded = Buffer.from(cursorStr, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    return parsed;
  } catch {
    // If it's a raw MongoDB ObjectId string (backward compatibility)
    return { id: cursorStr };
  }
}

/**
 * Hybrid Bucket Seeded Shuffling:
 * Separates candidates into highMatch (>= 75%) and standardMatch (< 75%) buckets
 * and applies deterministic seeded shuffle within each bucket.
 */
export function bucketSeededShuffle(candidates, sessionSeed) {
  const highMatchBucket = candidates.filter(c => c.matchPercentage >= 75);
  const standardMatchBucket = candidates.filter(c => c.matchPercentage < 75);

  const shuffledHigh = seededShuffle(highMatchBucket, `${sessionSeed}_high`);
  const shuffledStandard = seededShuffle(standardMatchBucket, `${sessionSeed}_std`);

  return [...shuffledHigh, ...shuffledStandard];
}
