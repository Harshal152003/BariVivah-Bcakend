import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import PaymentTransaction, { PAYMENT_STATUS } from '@/models/PaymentTransaction';
import paymentService from '@/services/paymentService';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
    }

    await connectDB();

    // 15 minutes cutoff threshold
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

    const pendingTransactions = await PaymentTransaction.find({
      status: PAYMENT_STATUS.PENDING,
      createdAt: { $lt: fifteenMinsAgo },
    }).limit(50);

    let repairedCount = 0;
    let expiredCount = 0;
    let errorsCount = 0;

    for (const transaction of pendingTransactions) {
      try {
        const result = await paymentService.getTransactionStatus({
          userId: transaction.userId,
          transactionId: transaction.transactionId,
        });

        if (result.status === PAYMENT_STATUS.CAPTURED) {
          repairedCount++;
        } else if (Date.now() - new Date(transaction.createdAt).getTime() > 24 * 60 * 60 * 1000) {
          // Mark orders older than 24h as EXPIRED if not captured
          transaction.status = PAYMENT_STATUS.EXPIRED;
          await transaction.save();
          expiredCount++;
        }
      } catch (err) {
        console.error(`Error reconciling transaction [${transaction.transactionId}]:`, err.message);
        errorsCount++;
      }
    }

    return NextResponse.json({
      success: true,
      scanned: pendingTransactions.length,
      repaired: repairedCount,
      expired: expiredCount,
      errors: errorsCount,
    });
  } catch (error) {
    console.error('❌ Error in payment reconciliation cron:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
