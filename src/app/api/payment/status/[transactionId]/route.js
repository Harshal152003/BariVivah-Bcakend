import { NextResponse } from 'next/server';
import paymentService, { PaymentError } from '@/services/paymentService';
import { verifyToken } from '@/lib/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

export async function GET(request, { params }) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required', code: 'MISSING_TRANSACTION_ID' },
        { status: 400, headers: corsHeaders }
      );
    }

    const statusResult = await paymentService.getTransactionStatus({
      userId,
      transactionId,
    });

    return NextResponse.json(
      {
        success: true,
        data: statusResult,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('❌ Error in GET /api/payment/status:', error);

    if (error instanceof PaymentError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error while fetching transaction status', code: 'SERVER_ERROR' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
