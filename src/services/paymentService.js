import crypto from 'crypto';
import Razorpay from 'razorpay';
import connectDB from '@/lib/dbConnect';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import PaymentTransaction, { PAYMENT_STATUS } from '@/models/PaymentTransaction';
import RazorpayWebhookEvent from '@/models/RazorpayWebhookEvent';

// Centralized error class for payment domain errors
export class PaymentError extends Error {
  constructor(code, message, statusCode = 400, details = null) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Valid state machine transitions
const VALID_TRANSITIONS = {
  [PAYMENT_STATUS.CREATED]: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.CANCELLED],
  [PAYMENT_STATUS.PENDING]: [PAYMENT_STATUS.AUTHORIZED, PAYMENT_STATUS.CAPTURED, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.CANCELLED, PAYMENT_STATUS.EXPIRED],
  [PAYMENT_STATUS.AUTHORIZED]: [PAYMENT_STATUS.CAPTURED, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.CANCELLED],
  [PAYMENT_STATUS.CAPTURED]: [PAYMENT_STATUS.REFUNDED, PAYMENT_STATUS.PARTIALLY_REFUNDED],
  [PAYMENT_STATUS.FAILED]: [],
  [PAYMENT_STATUS.CANCELLED]: [],
  [PAYMENT_STATUS.REFUNDED]: [],
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: [],
  [PAYMENT_STATUS.EXPIRED]: [],
};

function validateStateTransition(currentStatus, targetStatus) {
  if (currentStatus === targetStatus) return true; // Idempotent same-state check
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new PaymentError(
      'PAYMENT_STATE_TRANSITION_INVALID',
      `Cannot transition payment status from ${currentStatus} to ${targetStatus}`,
      400
    );
  }
  return true;
}

// Helper to get initialized Razorpay SDK client
function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new PaymentError(
      'PAYMENT_CONFIGURATION_ERROR',
      'Razorpay API credentials (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) are missing in environment configuration',
      500
    );
  }

  return new Razorpay({ key_id, key_secret });
}

// Timing-safe HMAC string comparison
function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Helper: Runs operations inside a Mongoose ACID transaction if available (Replica Set / Atlas), otherwise runs directly
async function withTransaction(fn) {
  await connectDB();
  const mongoose = require('mongoose');

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }
    // Fallback if local MongoDB is a standalone single-node instance (no replica set)
    if (
      err.message &&
      (err.message.includes('Transaction numbers are only allowed') ||
        err.message.includes('replica set') ||
        err.message.includes('standalone'))
    ) {
      return await fn(null);
    }
    throw err;
  } finally {
    if (session) {
      session.endSession();
    }
  }
}

class PaymentService {
  /**
   * 1. CREATE ORDER API SERVICE
   * Server-side calculation of order amount & initiation of local + Razorpay transaction
   */
  async createOrder({ userId, planId }) {
    await connectDB();

    if (!userId || !planId) {
      throw new PaymentError('INVALID_INPUT', 'userId and planId are required', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new PaymentError('USER_NOT_FOUND', 'Authenticated user not found', 404);
    }

    const plan = await Subscription.findById(planId);
    if (!plan || plan.isActive === false) {
      throw new PaymentError('PLAN_NOT_FOUND', 'Requested subscription plan is unavailable or inactive', 404);
    }

    if (typeof plan.price !== 'number' || plan.price <= 0) {
      throw new PaymentError('INVALID_PLAN_PRICE', 'Invalid subscription plan price', 400);
    }

    const receipt = `rcpt_bv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const transactionId = `bv_tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const amountInPaise = Math.round(plan.price * 100);

    // 1. Create local transaction record in CREATED state
    const transaction = await PaymentTransaction.create({
      transactionId,
      userId: user._id,
      planId: plan._id,
      amount: plan.price,
      currency: 'INR',
      receipt,
      status: PAYMENT_STATUS.CREATED,
      planSnapshot: {
        name: plan.name,
        price: plan.price,
        durationInDays: plan.durationInDays,
        contactUnlockLimit: plan.features?.contactUnlockLimit || 0,
        features: plan.features || {},
      },
    });

    // 2. Initiate Razorpay Order with strict server-calculated amount
    let razorpayOrder;
    try {
      const rzp = getRazorpayClient();
      razorpayOrder = await rzp.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          transactionId,
          userId: user._id.toString(),
          planId: plan._id.toString(),
          planName: plan.name,
        },
      });
    } catch (rzpErr) {
      console.error('❌ Razorpay order creation failed:', rzpErr);
      transaction.status = PAYMENT_STATUS.FAILED;
      transaction.failedAt = new Date();
      transaction.failureReason = rzpErr.message || 'Razorpay order creation failed';
      await transaction.save();

      throw new PaymentError(
        'PAYMENT_ORDER_CREATION_FAILED',
        'Failed to create payment order with payment gateway',
        502,
        rzpErr.message
      );
    }

    // 3. Update local transaction to PENDING state with Razorpay Order ID
    validateStateTransition(transaction.status, PAYMENT_STATUS.PENDING);
    transaction.razorpayOrderId = razorpayOrder.id;
    transaction.status = PAYMENT_STATUS.PENDING;
    await transaction.save();

    console.log(`✅ Order created successfully: TxID [${transactionId}] RzpOrderId [${razorpayOrder.id}]`);

    return {
      transactionId: transaction.transactionId,
      razorpayOrderId: razorpayOrder.id,
      amount: plan.price,
      amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      planName: plan.name,
      receipt,
    };
  }

  /**
   * 2. VERIFY PAYMENT API SERVICE
   * Validates Razorpay HMAC signature and verifies payment state directly with Razorpay REST API
   */
  async verifyPayment({ userId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    await connectDB();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new PaymentError(
        'INVALID_VERIFICATION_PAYLOAD',
        'Missing required payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature)',
        400
      );
    }

    // 1. Fetch local payment transaction using server-stored order ID
    const transaction = await PaymentTransaction.findOne({ razorpayOrderId: razorpay_order_id });
    if (!transaction) {
      throw new PaymentError('PAYMENT_TRANSACTION_NOT_FOUND', 'Payment transaction record not found', 404);
    }

    // 2. Authorization check: Ensure user owns this transaction
    if (transaction.userId.toString() !== userId.toString()) {
      throw new PaymentError('PAYMENT_ACCESS_DENIED', 'Unauthorized access to payment transaction', 403);
    }

    // 3. Idempotency Check: If already processed and captured, return current success status
    if (transaction.status === PAYMENT_STATUS.CAPTURED) {
      console.log(`ℹ️ Payment already captured for order [${razorpay_order_id}]. Idempotent verification response.`);
      const user = await User.findById(userId);
      return {
        success: true,
        alreadyProcessed: true,
        transactionId: transaction.transactionId,
        status: transaction.status,
        subscription: user?.subscription || null,
      };
    }

    // 4. Verify HMAC-SHA256 signature using server secret
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new PaymentError('CONFIG_ERROR', 'RAZORPAY_KEY_SECRET missing', 500);
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = timingSafeCompare(generatedSignature, razorpay_signature);

    if (!isSignatureValid) {
      console.error(`🚨 Invalid signature attempt for order [${razorpay_order_id}]`);
      if (transaction.status !== PAYMENT_STATUS.CAPTURED) {
        transaction.status = PAYMENT_STATUS.FAILED;
        transaction.failedAt = new Date();
        transaction.failureReason = 'INVALID_HMAC_SIGNATURE';
        await transaction.save();
      }
      throw new PaymentError('PAYMENT_SIGNATURE_INVALID', 'Payment verification failed: Invalid digital signature', 400);
    }

    // 5. Fetch payment object from Razorpay REST API to verify amount, currency, and status
    const rzp = getRazorpayClient();
    let paymentDetails;
    try {
      paymentDetails = await rzp.payments.fetch(razorpay_payment_id);
    } catch (err) {
      console.error('❌ Failed to fetch payment details from Razorpay:', err);
      throw new PaymentError('RAZORPAY_FETCH_FAILED', 'Unable to verify payment status with payment gateway', 502);
    }

    // 6. Server-side payment validation assertions
    if (paymentDetails.order_id !== razorpay_order_id) {
      throw new PaymentError('PAYMENT_ORDER_MISMATCH', 'Razorpay order ID does not match transaction', 400);
    }

    const expectedAmountPaise = Math.round(transaction.amount * 100);
    if (paymentDetails.amount !== expectedAmountPaise) {
      console.error(`🚨 Amount Mismatch! Expected ${expectedAmountPaise}, got ${paymentDetails.amount}`);
      throw new PaymentError('PAYMENT_AMOUNT_MISMATCH', 'Paid amount does not match plan price', 400);
    }

    if (paymentDetails.currency !== transaction.currency) {
      throw new PaymentError('PAYMENT_CURRENCY_MISMATCH', 'Payment currency mismatch', 400);
    }

    if (paymentDetails.status !== 'captured' && paymentDetails.status !== 'authorized') {
      throw new PaymentError('PAYMENT_NOT_CAPTURED', `Payment is in invalid state: ${paymentDetails.status}`, 400);
    }

    // 7. Atomic entitlement activation
    return await this.processSuccessfulPayment({
      transactionId: transaction.transactionId,
      razorpayPaymentId: razorpay_payment_id,
      signature: razorpay_signature,
      paymentMethod: paymentDetails.method || 'unknown',
      source: 'VERIFY_API',
    });
  }

  /**
   * 3. ATOMIC IDEMPOTENT SUBSCRIPTION ACTIVATION
   * Guarantees 1 Captured Payment = Exactly 1 Entitlement Grant
   */
  async processSuccessfulPayment({ transactionId, razorpayOrderId, razorpayPaymentId, signature, paymentMethod, source }) {
    await connectDB();

    let queryFilter = {};
    if (transactionId) queryFilter.transactionId = transactionId;
    else if (razorpayOrderId) queryFilter.razorpayOrderId = razorpayOrderId;
    else {
      throw new PaymentError('INVALID_INPUT', 'Transaction identifier required for activation', 400);
    }

    // 1. ATOMIC STATE LOCK: Only 1 concurrent thread can transition PENDING -> CAPTURED
    const lockedTx = await PaymentTransaction.findOneAndUpdate(
      {
        ...queryFilter,
        status: { $ne: PAYMENT_STATUS.CAPTURED },
      },
      {
        $set: {
          status: PAYMENT_STATUS.CAPTURED,
          razorpayPaymentId: razorpayPaymentId || undefined,
          signature: signature || undefined,
          paymentMethod: paymentMethod || undefined,
          capturedAt: new Date(),
          'metadata.activatedBy': source || 'UNKNOWN',
          'metadata.activatedAt': new Date().toISOString(),
        },
      },
      { new: true }
    );

    // If lockedTx is null, either the transaction doesn't exist OR it was already CAPTURED by a concurrent thread
    if (!lockedTx) {
      const existingTx = await PaymentTransaction.findOne(queryFilter);
      if (!existingTx) {
        throw new PaymentError('TRANSACTION_NOT_FOUND', 'Payment transaction not found for activation', 404);
      }

      if (existingTx.status === PAYMENT_STATUS.CAPTURED) {
        console.log(`⚡ [Idempotency] Transaction [${existingTx.transactionId}] already CAPTURED via ${existingTx.metadata?.activatedBy || 'previous thread'}. Returning user status.`);
        const user = await User.findById(existingTx.userId);
        return {
          success: true,
          alreadyProcessed: true,
          transactionId: existingTx.transactionId,
          status: existingTx.status,
          subscription: user?.subscription || null,
        };
      }
    }

    // Execute User Entitlement update inside Mongoose ACID session if available
    return await withTransaction(async (session) => {
      // Fetch Plan details
      let plan = await Subscription.findById(lockedTx.planId).session(session || null);
      const planName = plan?.name || lockedTx.planSnapshot?.name || 'Premium Plan';
      const durationDays = plan?.durationInDays || lockedTx.planSnapshot?.durationInDays || 30;
      const unlockLimit = plan?.features?.contactUnlockLimit !== undefined
        ? plan.features.contactUnlockLimit
        : (lockedTx.planSnapshot?.contactUnlockLimit || 0);

      // Check current user subscription to handle stacking / extending active plan days
      const currentUser = await User.findById(lockedTx.userId).session(session || null);
      let baseDate = new Date();
      if (currentUser?.subscription?.isSubscribed && currentUser?.subscription?.expiresAt) {
        const currentExp = new Date(currentUser.subscription.expiresAt).getTime();
        if (currentExp > Date.now()) {
          baseDate = new Date(currentExp); // Extend duration onto existing active plan expiry
        }
      }

      const expiresAt = new Date(baseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

      // Update User Document Entitlement Atomically
      const updatedUser = await User.findByIdAndUpdate(
        lockedTx.userId,
        {
          $set: {
            'subscription.plan': planName.trim(),
            'subscription.isSubscribed': true,
            'subscription.startDate': currentUser?.subscription?.startDate || new Date(),
            'subscription.expiresAt': expiresAt,
            'subscription.transactionId': razorpayPaymentId || lockedTx.transactionId,
            'subscription.subscriptionId': lockedTx.planId,
            'subscription.contactUnlockLimit': unlockLimit,
            'subscription.contactsUsed': 0, // Reset contact usage for the new plan cycle
            'subscription.chatEnabled': plan?.features?.chatEnabled ?? true,
            'subscription.visitorHistory': plan?.features?.visitorHistory ?? true,
            'subscription.profileBoosts': plan?.features?.profileBoosts || 0,
            'subscription.advancedFilters': plan?.features?.advancedFilters ?? true,
          },
        },
        { new: true, session: session || undefined }
      );

      if (!updatedUser) {
        throw new PaymentError('USER_NOT_FOUND', 'Failed to locate user for entitlement grant', 404);
      }

      console.log(`🎉 Subscription successfully activated for User [${lockedTx.userId}] Plan [${planName}] via ${source} (Expires: ${expiresAt.toISOString()})`);

      return {
        success: true,
        transactionId: lockedTx.transactionId,
        status: lockedTx.status,
        subscription: updatedUser.subscription,
      };
    });
  }

  /**
   * 4. PROCESS REFUNDED PAYMENT
   */
  async processRefundedPayment({ razorpayOrderId, razorpayPaymentId, refundId, amount, source }) {
    await connectDB();
    const transaction = await PaymentTransaction.findOne({
      $or: [{ razorpayOrderId }, { razorpayPaymentId }],
    });
    if (!transaction) return;

    transaction.status = PAYMENT_STATUS.REFUNDED;
    transaction.refundedAt = new Date();
    transaction.metadata = {
      ...transaction.metadata,
      refundId,
      refundAmount: amount,
      refundedBy: source || 'UNKNOWN',
    };
    await transaction.save();

    // Revoke user active subscription
    await User.findByIdAndUpdate(transaction.userId, {
      $set: {
        'subscription.isSubscribed': false,
        'subscription.status': 'cancelled',
      },
    });

    console.log(`↩️ Subscription revoked & transaction marked REFUNDED for User [${transaction.userId}] via ${source}`);
  }

  /**
   * 5. WEBHOOK HANDLER & DEDUPLICATION
   */
  async processWebhook({ rawBody, signature }) {
    await connectDB();

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new PaymentError('CONFIG_ERROR', 'RAZORPAY_WEBHOOK_SECRET missing in environment', 500);
    }

    if (!rawBody || !signature) {
      throw new PaymentError('WEBHOOK_INVALID', 'Missing raw body or webhook signature', 400);
    }

    // 1. Verify HMAC Signature over raw HTTP request body
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (!timingSafeCompare(expectedSignature, signature)) {
      console.error('🚨 Webhook Signature Verification Failed!');
      throw new PaymentError('WEBHOOK_SIGNATURE_INVALID', 'Invalid webhook signature', 400);
    }

    let event;
    try {
      event = JSON.parse(rawBody.toString('utf-8'));
    } catch (err) {
      throw new PaymentError('WEBHOOK_JSON_INVALID', 'Invalid JSON payload in webhook', 400);
    }

    const eventId = event.event_id || event.id || `evt_${Date.now()}`;
    const eventType = event.event;

    console.log(`📩 Webhook Event Received: ID [${eventId}] Type [${eventType}]`);

    // 2. Deduplicate Event ID in MongoDB
    try {
      await RazorpayWebhookEvent.create({
        eventId,
        eventType,
        razorpayOrderId: event.payload?.payment?.entity?.order_id || event.payload?.order?.entity?.id || null,
        razorpayPaymentId: event.payload?.payment?.entity?.id || null,
        status: 'RECEIVED',
        payload: { eventType, eventId },
      });
    } catch (dbErr) {
      if (dbErr.code === 11000) {
        console.log(`🔁 Webhook Event [${eventId}] already received & processed. Idempotent 200 response.`);
        return { success: true, duplicate: true };
      }
      throw dbErr;
    }

    // 3. Dispatch Business Logic by Event Type
    try {
      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        const paymentEntity = event.payload?.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id || event.payload?.order?.entity?.id;
        const razorpayPaymentId = paymentEntity?.id;

        if (razorpayOrderId) {
          await this.processSuccessfulPayment({
            razorpayOrderId,
            razorpayPaymentId,
            paymentMethod: paymentEntity?.method || 'webhook',
            source: `WEBHOOK:${eventType}`,
          });
        }
      } else if (eventType === 'payment.failed') {
        const paymentEntity = event.payload?.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id;
        const razorpayPaymentId = paymentEntity?.id;
        const reason = paymentEntity?.error_description || paymentEntity?.error_reason || 'Payment failed';

        if (razorpayOrderId) {
          await this.processFailedPayment({ razorpayOrderId, razorpayPaymentId, failureReason: reason, source: 'WEBHOOK' });
        }
      } else if (eventType === 'payment.refunded' || eventType === 'refund.processed') {
        const refundEntity = event.payload?.refund?.entity || event.payload?.payment?.entity;
        const razorpayOrderId = refundEntity?.order_id;
        const razorpayPaymentId = refundEntity?.payment_id || refundEntity?.id;
        const refundId = event.payload?.refund?.entity?.id;
        const amount = refundEntity?.amount ? refundEntity.amount / 100 : 0;

        if (razorpayOrderId || razorpayPaymentId) {
          await this.processRefundedPayment({
            razorpayOrderId,
            razorpayPaymentId,
            refundId,
            amount,
            source: `WEBHOOK:${eventType}`,
          });
        }
      }

      // Mark event as PROCESSED
      await RazorpayWebhookEvent.updateOne(
        { eventId },
        { $set: { status: 'PROCESSED', processedAt: new Date() } }
      );

      return { success: true };
    } catch (err) {
      console.error(`❌ Webhook processing error for event [${eventId}]:`, err);
      await RazorpayWebhookEvent.updateOne(
        { eventId },
        { $set: { status: 'FAILED', error: err.message } }
      );
      throw err;
    }
  }

  /**
   * 5. PROCESS FAILED PAYMENT
   */
  async processFailedPayment({ razorpayOrderId, razorpayPaymentId, failureReason, source }) {
    await connectDB();
    const transaction = await PaymentTransaction.findOne({ razorpayOrderId });
    if (!transaction) return;

    if (transaction.status === PAYMENT_STATUS.CAPTURED) {
      console.warn(`⚠️ Attempted to mark CAPTURED transaction [${transaction.transactionId}] as FAILED via ${source}. Ignored.`);
      return;
    }

    if (transaction.status !== PAYMENT_STATUS.FAILED) {
      transaction.status = PAYMENT_STATUS.FAILED;
      transaction.failedAt = new Date();
      transaction.razorpayPaymentId = razorpayPaymentId || transaction.razorpayPaymentId;
      transaction.failureReason = failureReason || 'Payment failed';
      await transaction.save();
      console.log(`❌ Transaction [${transaction.transactionId}] marked as FAILED via ${source}`);
    }
  }

  /**
   * 6. GET TRANSACTION STATUS & RECONCILE
   */
  async getTransactionStatus({ userId, transactionId }) {
    await connectDB();

    const transaction = await PaymentTransaction.findOne({
      $or: [{ transactionId }, { razorpayOrderId: transactionId }],
    });

    if (!transaction) {
      throw new PaymentError('TRANSACTION_NOT_FOUND', 'Payment transaction not found', 404);
    }

    if (transaction.userId.toString() !== userId.toString()) {
      throw new PaymentError('ACCESS_DENIED', 'Unauthorized to view this transaction', 403);
    }

    // Auto-reconciliation check: If status is PENDING, verify with Razorpay REST API
    if (transaction.status === PAYMENT_STATUS.PENDING && transaction.razorpayOrderId) {
      try {
        const rzp = getRazorpayClient();
        const payments = await rzp.orders.fetchPayments(transaction.razorpayOrderId);
        if (payments && payments.items && payments.items.length > 0) {
          const capturedPayment = payments.items.find(p => p.status === 'captured');
          if (capturedPayment) {
            console.log(`🔄 [Reconciliation] Found captured payment [${capturedPayment.id}] for pending order [${transaction.razorpayOrderId}]. Auto-repairing state...`);
            await this.processSuccessfulPayment({
              transactionId: transaction.transactionId,
              razorpayPaymentId: capturedPayment.id,
              paymentMethod: capturedPayment.method,
              source: 'AUTO_RECONCILIATION',
            });
            // Refetch updated transaction
            const updatedTx = await PaymentTransaction.findById(transaction._id);
            const user = await User.findById(userId);
            return {
              transactionId: updatedTx.transactionId,
              status: updatedTx.status,
              amount: updatedTx.amount,
              currency: updatedTx.currency,
              planSnapshot: updatedTx.planSnapshot,
              capturedAt: updatedTx.capturedAt,
              subscription: user?.subscription || null,
            };
          }
        }
      } catch (err) {
        console.warn('⚠️ Auto-reconciliation API fetch failed:', err.message);
      }
    }

    const user = await User.findById(userId);

    return {
      transactionId: transaction.transactionId,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      planSnapshot: transaction.planSnapshot,
      createdAt: transaction.createdAt,
      capturedAt: transaction.capturedAt,
      failedAt: transaction.failedAt,
      failureReason: transaction.failureReason,
      subscription: user?.subscription || null,
    };
  }
}

export default new PaymentService();
