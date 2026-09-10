import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/dbConnect';
import PaymentTransaction, { PAYMENT_STATUS } from '@/models/PaymentTransaction';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import { computeGstBreakdown } from '@/services/paymentService';
import { verifyToken } from '@/lib/auth';

function getUserIdFromRequest(request) {
  let token = request.cookies.get('authToken')?.value;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  if (!token) {
    // Optional fallback query param if provided
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');
    if (queryUserId && mongoose.Types.ObjectId.isValid(queryUserId)) {
      return queryUserId;
    }
    return null;
  }
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

export async function GET(request) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. Fetch only successfully completed (CAPTURED) transactions for this user
    const transactions = await PaymentTransaction.find({
      userId: user._id,
      status: PAYMENT_STATUS.CAPTURED,
    })
      .sort({ createdAt: -1 })
      .lean();

    const invoices = transactions.map((tx) => {
      const invoiceNo = tx.invoiceDetails?.invoiceNumber || tx.receipt || `INV-${tx.transactionId}`;
      const planName = tx.planSnapshot?.name || 'Premium Plan';
      const baseAmount = tx.gstBreakdown?.baseAmount || tx.amount || 0;
      const totalTax = tx.gstBreakdown?.totalTax || 0;
      const totalAmount = tx.gstBreakdown?.totalAmount || tx.amount || 0;
      const date = tx.capturedAt || tx.createdAt || new Date();

      return {
        id: tx._id.toString(),
        transactionId: tx.transactionId,
        razorpayPaymentId: tx.razorpayPaymentId || null,
        invoiceNumber: invoiceNo,
        planName,
        status: tx.status,
        date: date,
        baseAmount,
        totalTax,
        totalAmount,
        currency: tx.currency || 'INR',
        downloadUrl: `/api/payment/invoice/${tx.transactionId}`,
      };
    });

    // 2. If no transactions exist in DB but user has an active subscription (e.g. simulated or legacy payment)
    if (invoices.length === 0 && user.subscription?.isSubscribed) {
      let plan = null;
      if (user.subscription.subscriptionId) {
        plan = await Subscription.findById(user.subscription.subscriptionId);
      }
      const basePrice = plan?.price || (user.subscription.plan?.toLowerCase().includes('gold') ? 999 : user.subscription.plan?.toLowerCase().includes('vip') ? 4999 : 499);
      const userState = user.state || user.currentCity || user.nativePlace || 'Maharashtra';
      const gst = computeGstBreakdown({ basePlanPrice: basePrice, userState });
      const targetTxn = user.subscription.transactionId || `BV-TXN-${Date.now()}`;

      invoices.push({
        id: `mock_${user._id}`,
        transactionId: targetTxn,
        razorpayPaymentId: targetTxn.startsWith('pay_') ? targetTxn : null,
        invoiceNumber: 'BV/26-27/INV-00001',
        planName: user.subscription.plan || 'Premium Membership Plan',
        status: PAYMENT_STATUS.CAPTURED,
        date: user.subscription.purchasedAt || user.subscription.startDate || new Date(),
        baseAmount: gst.baseAmount,
        totalTax: gst.totalTax,
        totalAmount: gst.totalAmount,
        currency: 'INR',
        downloadUrl: `/api/payment/invoice/${targetTxn}`,
      });
    }

    return NextResponse.json({
      success: true,
      invoices,
      count: invoices.length,
    });
  } catch (error) {
    console.error('❌ Error fetching user invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices', details: error.message }, { status: 500 });
  }
}
