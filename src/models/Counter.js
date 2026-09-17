import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Identifier for the counter (e.g., 'profileId')
    seq: { type: Number, default: 100000 }, // Starting sequence offset
  },
  {
    timestamps: true,
  }
);

delete mongoose.models.Counter;
export default mongoose.models.Counter || mongoose.model('Counter', CounterSchema);
