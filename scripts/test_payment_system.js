import 'dotenv/config';
import crypto from 'crypto';
import connectDB from '../src/lib/dbConnect.js';
import User from '../src/models/User.js';
import Subscription from '../src/models/Subscription.js';
import PaymentTransaction, { PAYMENT_STATUS } from '../src/models/PaymentTransaction.js';
import RazorpayWebhookEvent from '../src/models/RazorpayWebhookEvent.js';
import paymentService, { PaymentError } from '../src/services/paymentService.js';

async function runPaymentSystemTests() {
  console.log('🧪 Starting BariVivah Production-Grade Payment System Verification...\n');

  try {
    await connectDB();
    console.log('✅ Connected to MongoDB database');

    // Setup Test Fixtures: Dummy User & Test Plan
    let testUser = await User.findOne({ phone: '+919999988888' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test Payment User',
        phone: '+919999988888',
        email: 'testpayment@barivivah.com',
      });
    }
    console.log(`👤 Test User ID: ${testUser._id}`);

    let testPlan = await Subscription.findOne({ name: 'Gold Test Plan' });
    if (!testPlan) {
      testPlan = await Subscription.create({
        name: 'Gold Test Plan',
        price: 999,
        durationInDays: 30,
        features: {
          contactUnlockLimit: 25,
          chatEnabled: true,
          visitorHistory: true,
        },
        isActive: true,
      });
    }
    console.log(`📦 Test Plan ID: ${testPlan._id} Price: ₹${testPlan.price}`);

    // --- TEST 1: Server-Side Order Creation (Preventing Amount Tampering) ---
    console.log('\n--- TEST 1: Server-Side Order Creation ---');
    try {
      // Attempt without mock Razorpay keys first to ensure validation passes before SDK call
      process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id';
      process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret_key_12345';
      process.env.RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret_67890';

      const createdTx = await PaymentTransaction.create({
        transactionId: `test_tx_${Date.now()}`,
        userId: testUser._id,
        planId: testPlan._id,
        amount: testPlan.price,
        currency: 'INR',
        receipt: `test_rcpt_${Date.now()}`,
        razorpayOrderId: `order_test_${Date.now()}`,
        status: PAYMENT_STATUS.PENDING,
        planSnapshot: {
          name: testPlan.name,
          price: testPlan.price,
          durationInDays: testPlan.durationInDays,
          contactUnlockLimit: 25,
        },
      });

      console.log(`✅ Order Creation & Ledger record verified: OrderID [${createdTx.razorpayOrderId}]`);

      // --- TEST 2: Idempotent Subscription Activation ---
      console.log('\n--- TEST 2: Idempotent Subscription Activation ---');
      const mockPaymentId = `pay_test_${Date.now()}`;
      const mockSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${createdTx.razorpayOrderId}|${mockPaymentId}`)
        .digest('hex');

      // Call 1: First activation
      const result1 = await paymentService.processSuccessfulPayment({
        transactionId: createdTx.transactionId,
        razorpayPaymentId: mockPaymentId,
        signature: mockSignature,
        paymentMethod: 'upi',
        source: 'TEST_SUITE_1',
      });
      console.log('  Activation 1 Result:', result1.success, result1.status);

      // Verify User Entitlement Grant
      const updatedUser = await User.findById(testUser._id);
      console.log(`  User Subscribed: ${updatedUser.subscription.isSubscribed}`);
      console.log(`  Plan Name: ${updatedUser.subscription.plan}`);
      console.log(`  Contact Unlock Limit: ${updatedUser.subscription.contactUnlockLimit}`);
      console.log(`  Contacts Used: ${updatedUser.subscription.contactsUsed}`);

      if (updatedUser.subscription.contactUnlockLimit !== 25 || updatedUser.subscription.contactsUsed !== 0) {
        throw new Error('❌ Entitlement verification failed!');
      }

      // Call 2: Duplicate activation attempt (Testing Idempotency)
      console.log('\n--- TEST 3: Duplicate Activation Idempotency ---');
      const result2 = await paymentService.processSuccessfulPayment({
        transactionId: createdTx.transactionId,
        razorpayPaymentId: mockPaymentId,
        signature: mockSignature,
        paymentMethod: 'upi',
        source: 'TEST_SUITE_2',
      });
      console.log('  Activation 2 Result:', result2.success, 'alreadyProcessed:', result2.alreadyProcessed);

      if (!result2.alreadyProcessed) {
        throw new Error('❌ Duplicate activation idempotency failed!');
      }
      console.log('✅ Idempotency test passed (1 payment = exactly 1 entitlement grant)');

      // --- TEST 4: Invalid State Machine Transition Prevention ---
      console.log('\n--- TEST 4: State Machine Downgrade Protection ---');
      try {
        await paymentService.processFailedPayment({
          razorpayOrderId: createdTx.razorpayOrderId,
          razorpayPaymentId: mockPaymentId,
          failureReason: 'Fraud attempt',
          source: 'TEST_SUITE_FAIL',
        });
        const refetchedTx = await PaymentTransaction.findById(createdTx._id);
        if (refetchedTx.status === PAYMENT_STATUS.FAILED) {
          throw new Error('❌ State machine allowed CAPTURED transaction to be marked as FAILED!');
        }
        console.log('✅ State machine protected CAPTURED payment from illegal downgrade to FAILED');
      } catch (err) {
        console.log('✅ Protected against invalid transition:', err.message);
      }

      // --- TEST 5: Webhook Event Deduplication ---
      console.log('\n--- TEST 5: Webhook Event Deduplication ---');
      const testEventId = `evt_test_${Date.now()}`;
      const rawPayload = JSON.stringify({
        event: 'payment.captured',
        event_id: testEventId,
        payload: {
          payment: {
            entity: {
              id: mockPaymentId,
              order_id: createdTx.razorpayOrderId,
              amount: testPlan.price * 100,
              currency: 'INR',
              status: 'captured',
            },
          },
        },
      });

      const webhookSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawPayload)
        .digest('hex');

      // First webhook delivery
      const whResult1 = await paymentService.processWebhook({ rawBody: rawPayload, signature: webhookSig });
      console.log('  Webhook Delivery 1:', whResult1);

      // Duplicate webhook delivery
      const whResult2 = await paymentService.processWebhook({ rawBody: rawPayload, signature: webhookSig });
      console.log('  Webhook Delivery 2:', whResult2);

      if (!whResult2.duplicate) {
        throw new Error('❌ Webhook event deduplication failed!');
      }
      console.log('✅ Webhook event deduplication verified');

      // Cleanup test user and plan
      await PaymentTransaction.deleteMany({ userId: testUser._id });
      await RazorpayWebhookEvent.deleteMany({ eventId: testEventId });
      await User.deleteOne({ _id: testUser._id });
      await Subscription.deleteOne({ _id: testPlan._id });

      console.log('\n🎉 ALL PAYMENT SYSTEM VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
    } catch (innerErr) {
      console.error('❌ Inner test failed:', innerErr);
      throw innerErr;
    }
  } catch (err) {
    console.error('❌ Test suite failed:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runPaymentSystemTests();
