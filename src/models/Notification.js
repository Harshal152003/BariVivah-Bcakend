import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "ADMIN_BROADCAST",
        "ACCOUNT_REPORT",
        "SUBSCRIPTION",
        "INTEREST",
        "SYSTEM_ALERT",
        "GENERAL",
      ],
      default: "ADMIN_BROADCAST",
    },
    priority: {
      type: String,
      enum: ["NORMAL", "HIGH", "URGENT"],
      default: "NORMAL",
    },
    recipientType: {
      type: String,
      enum: ["ALL", "SPECIFIC", "GROUP"],
      default: "ALL",
      required: true,
    },
    recipientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    targetGroup: {
      type: String,
      enum: [
        "ALL",
        "FREE_USERS",
        "PREMIUM_USERS",
        "MALE",
        "FEMALE",
        "UNVERIFIED",
        "VERIFIED",
      ],
      default: "ALL",
    },
    actionUrl: {
      type: String,
      default: null, // e.g., "/(dashboard)/subscription" or "/(dashboard)/invoices"
    },
    icon: {
      type: String,
      default: null,
    },
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      default: "ADMIN",
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// High performance indexes
NotificationSchema.index({ recipientType: 1, createdAt: -1 });
NotificationSchema.index({ recipientUser: 1, createdAt: -1 });
NotificationSchema.index({ targetGroup: 1, createdAt: -1 });
NotificationSchema.index({ "readBy.userId": 1 });

delete mongoose.models.Notification;
export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
