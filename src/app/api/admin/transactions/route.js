import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import PaymentTransaction, { PAYMENT_STATUS } from '@/models/PaymentTransaction';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

function getAdminUser(request) {
  let token = request.cookies.get('authToken')?.value;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded;
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim();
    const status = searchParams.get('status') || 'ALL';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    // Filter construction
    let query = {};
    if (status !== 'ALL') {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { transactionId: regex },
        { razorpayPaymentId: regex },
        { razorpayOrderId: regex },
        { 'invoiceDetails.invoiceNumber': regex },
        { 'billingDetails.customerName': regex },
        { 'billingDetails.customerPhone': regex },
        { 'billingDetails.customerEmail': regex },
        { 'billingDetails.billingState': regex },
        { 'planSnapshot.name': regex },
      ];
    }

    // Parallel fetch: Paginated transactions + Overall Aggregations
    const [transactions, totalCount, statsAgg] = await Promise.all([
      PaymentTransaction.find(query)
        .populate('userId', 'name fullName email phone state currentCity')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PaymentTransaction.countDocuments(query),
      PaymentTransaction.aggregate([
        { $match: { status: PAYMENT_STATUS.CAPTURED } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$amount' },
            totalBaseAmount: { $sum: { $ifNull: ['$gstBreakdown.baseAmount', '$amount'] } },
            totalTax: { $sum: { $ifNull: ['$gstBreakdown.totalTax', 0] } },
            totalCgst: { $sum: { $ifNull: ['$gstBreakdown.cgst', 0] } },
            totalSgst: { $sum: { $ifNull: ['$gstBreakdown.sgst', 0] } },
            totalIgst: { $sum: { $ifNull: ['$gstBreakdown.igst', 0] } },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const stats = statsAgg[0] || {
      totalRevenue: 0,
      totalBaseAmount: 0,
      totalTax: 0,
      totalCgst: 0,
      totalSgst: 0,
      totalIgst: 0,
      count: 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit) || 1,
        },
        stats: {
          totalRevenue: Math.round(stats.totalRevenue * 100) / 100,
          totalBaseAmount: Math.round(stats.totalBaseAmount * 100) / 100,
          totalTax: Math.round(stats.totalTax * 100) / 100,
          totalCgst: Math.round(stats.totalCgst * 100) / 100,
          totalSgst: Math.round(stats.totalSgst * 100) / 100,
          totalIgst: Math.round(stats.totalIgst * 100) / 100,
          capturedCount: stats.count,
        },
      },
    });
  } catch (error) {
    console.error('❌ Error fetching admin transactions:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
