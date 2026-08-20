import { NextResponse } from 'next/server';
import paymentService, { PaymentError } from '@/services/paymentService';
import { verifyToken } from '@/lib/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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

export async function POST(request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment response tokens', code: 'INVALID_PAYLOAD' },
        { status: 400, headers: corsHeaders }
      );
    }

    const verifyResult = await paymentService.verifyPayment({
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    return NextResponse.json(
      {
        success: true,
        data: verifyResult,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('❌ Error in /api/payment/verify:', error);

    if (error instanceof PaymentError) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.statusCode, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error while verifying payment', code: 'SERVER_ERROR' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
