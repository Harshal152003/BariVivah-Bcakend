import { NextResponse } from 'next/server';
import paymentService, { PaymentError } from '@/services/paymentService';
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

export async function PATCH(req) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Direct client plan modification is disabled. Valid Razorpay checkout verification tokens (razorpay_order_id, razorpay_payment_id, razorpay_signature) are required." },
      { status: 400 }
    );
  }

  try {
    const verifyResult = await paymentService.verifyPayment({
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    return NextResponse.json({ message: "Subscription updated successfully", user: verifyResult.subscription }, { status: 200 });
  } catch (err) {
    console.error("Subscription update error:", err);
    const status = err instanceof PaymentError ? err.statusCode : 500;
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status });
  }
}

