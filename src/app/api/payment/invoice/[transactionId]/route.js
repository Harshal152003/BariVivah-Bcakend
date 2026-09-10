import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/dbConnect';
import PaymentTransaction, { PAYMENT_STATUS } from '@/models/PaymentTransaction';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import invoiceService, { getStateCode } from '@/services/invoiceService';
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
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(transactionId);

    // 1. Try finding by any transaction identifier
    let transaction = await PaymentTransaction.findOne({
      $or: [
        { transactionId },
        { razorpayOrderId: transactionId },
        { razorpayPaymentId: transactionId },
        { 'invoiceDetails.invoiceNumber': transactionId },
        ...(isObjectId ? [{ _id: transactionId }] : []),
      ],
    });

    let user = null;

    // 2. If not found directly, check if the identifier belongs to a user's subscription or user ID
    if (!transaction) {
      user = await User.findOne({
        $or: [
          { 'subscription.transactionId': transactionId },
          ...(isObjectId ? [{ _id: transactionId }] : []),
        ],
      });

      if (user) {
        // Try finding their latest captured transaction
        transaction = await PaymentTransaction.findOne({
          userId: user._id,
          status: PAYMENT_STATUS.CAPTURED,
        }).sort({ createdAt: -1 });

        // 3. Fallback for test/mock purchases or subscriptions without a DB transaction record
        if (!transaction && user.subscription?.isSubscribed) {
          let plan = null;
          if (user.subscription.subscriptionId) {
            plan = await Subscription.findById(user.subscription.subscriptionId);
          }
          const basePrice = plan?.price || (user.subscription.plan?.toLowerCase().includes('gold') ? 999 : user.subscription.plan?.toLowerCase().includes('vip') ? 4999 : 499);
          const userState = user.state || user.currentCity || user.nativePlace || 'Maharashtra';
          const gst = computeGstBreakdown({ basePlanPrice: basePrice, userState });

          transaction = {
            transactionId: user.subscription.transactionId || `BV-TXN-${Date.now()}`,
            razorpayPaymentId: user.subscription.transactionId?.startsWith('pay_') ? user.subscription.transactionId : null,
            userId: user._id,
            status: PAYMENT_STATUS.CAPTURED,
            amount: gst.totalAmount,
            currency: 'INR',
            gstBreakdown: gst,
            billingDetails: {
              customerName: user.name || user.fullName || 'Valued Member',
              customerEmail: user.email || '',
              customerPhone: user.phone || user.mobile || '',
              billingState: gst.billingState,
              billingStateCode: gst.billingStateCode,
              customerGstin: '',
            },
            planSnapshot: {
              name: user.subscription.plan || 'Premium Membership Plan',
              price: basePrice,
              durationInDays: plan?.durationInDays || 90,
            },
            invoiceDetails: {
              invoiceNumber: `BV/26-27/INV-00001`,
              invoiceDate: user.subscription.purchasedAt || user.subscription.startDate || new Date(),
            },
            capturedAt: user.subscription.purchasedAt || user.subscription.startDate || new Date(),
          };
        }
      }
    }

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.status !== PAYMENT_STATUS.CAPTURED) {
      return NextResponse.json(
        { error: 'Tax Invoice is only available for successful (CAPTURED) payments' },
        { status: 400 }
      );
    }

    const requestingUserId = getUserIdFromRequest(request);
    // If authenticated, ensure the user owns the transaction (or is admin)
    if (requestingUserId && transaction.userId && transaction.userId.toString() !== requestingUserId.toString()) {
      const authUser = await User.findById(requestingUserId);
      if (authUser?.role !== 'admin') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    if (!user && transaction.userId) {
      user = await User.findById(transaction.userId);
    }

    const pdfBuffer = await invoiceService.generateTaxInvoicePdf({ transaction, user });

    const invoiceNo = transaction.invoiceDetails?.invoiceNumber || transaction.transactionId;
    const safeFilename = `BariVivah_Tax_Invoice_${String(invoiceNo).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('❌ Error generating tax invoice PDF:', error);
    return NextResponse.json({ error: 'Failed to generate tax invoice', details: error.message }, { status: 500 });
  }
}
