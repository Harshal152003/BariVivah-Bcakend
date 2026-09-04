import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Banner image URL is required"],
      trim: true,
    },
    targetUrl: {
      type: String,
      trim: true,
      default: "/(dashboard)/subscription",
    },
    targetType: {
      type: String,
      enum: ["in_app", "external", "none"],
      default: "in_app",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Delete model if already compiled in development to avoid schema caching issues
if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Banner;
}

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
