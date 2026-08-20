import { NextResponse } from 'next/server';
import paymentService, { PaymentError } from '@/services/paymentService';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.warn('⚠️ Webhook request received without x-razorpay-signature header');
      return NextResponse.json(
        { error: 'Missing x-razorpay-signature header' },
        { status: 400 }
      );
    }

    // Read exact raw body string/buffer directly from HTTP stream
    const rawBody = await request.text();

    const webhookResult = await paymentService.processWebhook({
      rawBody,
      signature,
    });

    return NextResponse.json(
      { success: true, ...webhookResult },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error in /api/payment/webhook:', error);

    if (error instanceof PaymentError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Internal webhook processing error' },
      { status: 500 }
    );
  }
}
