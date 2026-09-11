import mongoose from 'mongoose';

const DeletedAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    profileId: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
      index: true,
    },
    email: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: '',
    },
    reasonCategory: {
      type: String,
      enum: ['Married', 'Other'],
      default: 'Other',
      index: true,
    },
    reasonText: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    plan: {
      type: String,
      default: 'Free',
    },
    registeredAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.DeletedAccount || mongoose.model('DeletedAccount', DeletedAccountSchema);
