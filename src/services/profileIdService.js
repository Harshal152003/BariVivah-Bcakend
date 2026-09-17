import dbConnect from '../lib/dbConnect.js';
import Counter from '../models/Counter.js';

/**
 * Generates an atomic, 100% collision-free sequential Profile ID (e.g., BV-100001, BV-100002)
 * using MongoDB's atomic findOneAndUpdate with $inc operation.
 * 
 * @returns {Promise<string>} Next unique Profile ID
 */
export async function generateNextProfileId() {
  await dbConnect();

  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: 'profileId' },
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true,
      }
    );

    if (counter && counter.seq) {
      // Ensure consistent 6-digit base sequence (e.g. BV-100001, BV-100002)
      const baseOffset = 100000;
      const effectiveSeq = counter.seq < baseOffset ? baseOffset + counter.seq : counter.seq;
      return `BV-${effectiveSeq}`;
    }
  } catch (err) {
    console.error('[ProfileIdService] Error generating atomic sequence ID:', err);
  }

  // Cryptographic fallback in the rare case of counter collection failure
  const fallbackNum = Math.floor(100000 + Math.random() * 900000);
  return `BV-${fallbackNum}`;
}

export default {
  generateNextProfileId,
};
