import mongoose from 'mongoose';

const contactUnlockSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    unlockedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    unlockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure uniqueness so a user can't unlock the same profile twice
contactUnlockSchema.index({ userId: 1, unlockedUserId: 1 }, { unique: true });

export default mongoose.models.ContactUnlock ||
  mongoose.model('ContactUnlock', contactUnlockSchema);
