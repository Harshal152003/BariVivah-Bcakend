// This file defines the Subscription model for a MongoDB database using Mongoose.
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    durationInDays: { type: Number, required: true },
    features: {
      contactUnlockLimit: { type: Number, default: 0 },
      chatEnabled: { type: Boolean, default: false },
      visitorHistory: { type: Boolean, default: false },
      profileBoosts: { type: Number, default: 0 },
      advancedFilters: { type: Boolean, default: false }
    },
    displayFeatures: [String],
    isActive: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);
