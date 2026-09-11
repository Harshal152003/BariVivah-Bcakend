import mongoose from 'mongoose';

export const PAYMENT_STATUS = {
  CREATED: 'CREATED',
  PENDING: 'PENDING',
  AUTHORIZED: 'AUTHORIZED',
  CAPTURED: 'CAPTURED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  EXPIRED: 'EXPIRED',
};

const PaymentTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    razorpayOrderId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true, // Amount in INR
    },
    currency: {
      type: String,
      default: 'INR',
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.CREATED,
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    signature: {
      type: String,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
    webhookEventId: {
      type: String,
      default: null,
    },
    planSnapshot: {
      name: String,
      price: Number,
      durationInDays: Number,
      contactUnlockLimit: Number,
      features: mongoose.Schema.Types.Mixed,
    },
    capturedAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    gstBreakdown: {
      sacCode: { type: String, default: '998599' },
      gstRate: { type: Number, default: 18 },
      isInclusive: { type: Boolean, default: false },
      baseAmount: { type: Number, default: 0 },
      cgst: { type: Number, default: 0 },
      sgst: { type: Number, default: 0 },
      igst: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
    },
    billingDetails: {
      customerName: { type: String, default: '' },
      customerEmail: { type: String, default: '' },
      customerPhone: { type: String, default: '' },
      billingState: { type: String, default: '' },
      billingStateCode: { type: String, default: '' },
      customerGstin: { type: String, default: '' },
    },
    invoiceDetails: {
      invoiceNumber: { type: String, default: null, sparse: true },
      invoiceDate: { type: Date, default: null },
      invoicePdfUrl: { type: String, default: null },
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound indexes
PaymentTransactionSchema.index({ userId: 1, createdAt: -1 });
PaymentTransactionSchema.index({ status: 1, createdAt: -1 });

delete mongoose.models.PaymentTransaction;
export default mongoose.models.PaymentTransaction ||
  mongoose.model('PaymentTransaction', PaymentTransactionSchema);
