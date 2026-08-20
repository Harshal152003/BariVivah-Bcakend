import mongoose from 'mongoose';

const RazorpayWebhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: ['RECEIVED', 'PROCESSED', 'FAILED', 'IGNORED'],
      default: 'RECEIVED',
      required: true,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

delete mongoose.models.RazorpayWebhookEvent;
export default mongoose.models.RazorpayWebhookEvent ||
  mongoose.model('RazorpayWebhookEvent', RazorpayWebhookEventSchema);
