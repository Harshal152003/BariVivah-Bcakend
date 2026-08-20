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
    const { planId } = body || {};

    if (!planId) {
      return NextResponse.json(
        { error: 'planId is required', code: 'MISSING_PLAN_ID' },
        { status: 400, headers: corsHeaders }
      );
    }

    const orderResult = await paymentService.createOrder({
      userId,
      planId,
    });

    return NextResponse.json(
      {
        success: true,
        data: orderResult,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('❌ Error in /api/payment/orders:', error);

    if (error instanceof PaymentError) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.statusCode, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error while creating payment order', code: 'SERVER_ERROR' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
