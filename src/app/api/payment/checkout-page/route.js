import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import PaymentTransaction from '@/models/PaymentTransaction';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const keyId = searchParams.get('keyId') || process.env.RAZORPAY_KEY_ID;
    const redirectUrl = searchParams.get('redirectUrl') || 'barivivahmobileapp://payment-callback';

    if (!orderId) {
      return new Response('<h2>Error: Order ID is required</h2>', {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    await connectDB();
    const transaction = await PaymentTransaction.findOne({ razorpayOrderId: orderId });

    if (!transaction) {
      return new Response('<h2>Error: Invalid or expired payment order</h2>', {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const amountInPaise = Math.round(transaction.amount * 100);
    const planName = transaction.planSnapshot?.name || 'BariVivah Premium';
    const userId = transaction.userId ? transaction.userId.toString() : '';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>BariVivah - Secure Razorpay Checkout</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0F172A;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 28px 24px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .logo {
      font-size: 26px;
      font-weight: 800;
      color: #E11D48;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }
    .plan {
      font-size: 18px;
      font-weight: 600;
      color: #F8FAFC;
      margin-bottom: 4px;
    }
    .price {
      font-size: 32px;
      font-weight: 800;
      color: #F59E0B;
      margin-bottom: 16px;
    }
    .spinner {
      border: 3px solid rgba(255,255,255,0.1);
      border-left-color: #F59E0B;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 0.9s linear infinite;
      margin: 20px auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .status {
      font-size: 14px;
      color: #94A3B8;
      margin-top: 12px;
      line-height: 1.5;
    }
    .success-badge {
      font-size: 48px;
      margin-bottom: 12px;
      display: none;
    }
    .btn-action {
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      border: none;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 20px;
      display: none;
      width: 100%;
      text-decoration: none;
    }
    .btn-retry {
      background: #E11D48;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 16px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">BariVivah</div>
    <div class="plan">${planName}</div>
    <div class="price">₹${transaction.amount}</div>
    
    <div class="success-badge" id="successBadge">🎉</div>
    <div class="spinner" id="spinner"></div>
    <div class="status" id="statusText">Opening Secure Payment Gateway...</div>

    <button class="btn-action" id="returnBtn" onclick="returnToApp()">Return to BariVivah App</button>
    <button class="btn-retry" id="retryBtn" onclick="openCheckout()">Retry Payment</button>
  </div>

  <script>
    let finalRedirectUrl = "${redirectUrl}";

    function returnToApp() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'SUCCESS' }));
      }
      window.location.href = finalRedirectUrl;
    }

    const options = {
      key: "${keyId}",
      amount: ${amountInPaise},
      currency: "${transaction.currency}",
      name: "BariVivah Matrimony",
      description: "${planName} Subscription",
      order_id: "${orderId}",
      prefill: {
        name: "User",
      },
      theme: {
        color: "#E11D48"
      },
      handler: async function (response) {
        document.getElementById('statusText').innerText = "Verifying payment signature with backend...";
        document.getElementById('spinner').style.display = 'block';

        const returnPayload = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          status: 'SUCCESS'
        };

        const queryParams = new URLSearchParams(returnPayload).toString();
        finalRedirectUrl = "${redirectUrl}?" + queryParams;

        // Perform instant server-side verification directly from page
        try {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer test'
            },
            body: JSON.stringify(returnPayload)
          });
          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('successBadge').style.display = 'block';
            document.getElementById('statusText').innerHTML = "<strong style='color:#10B981;'>Payment Verified & Subscription Activated!</strong><br>Your account has been upgraded.";
            document.getElementById('returnBtn').style.display = 'block';

            // Auto redirect after 1.5 seconds
            setTimeout(returnToApp, 1500);
            return;
          }
        } catch (e) {
          console.warn('Direct verify fetch failed, attempting redirect:', e);
        }

        // Fallback to app deep link redirect
        returnToApp();
      },
      modal: {
        ondismiss: function() {
          document.getElementById('statusText').innerText = "Payment cancelled by user.";
          document.getElementById('spinner').style.display = 'none';
          document.getElementById('retryBtn').style.display = 'inline-block';

          finalRedirectUrl = "${redirectUrl}?status=CANCELLED";
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'CANCELLED' }));
          }
          window.location.href = finalRedirectUrl;
        }
      }
    };

    const rzp1 = new Razorpay(options);

    rzp1.on('payment.failed', function (response){
      document.getElementById('statusText').innerText = "Payment Failed: " + (response.error.description || "Transaction failed");
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('retryBtn').style.display = 'inline-block';

      finalRedirectUrl = "${redirectUrl}?status=FAILED&error=" + encodeURIComponent(response.error.description || 'Payment Failed');
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'FAILED' }));
      }
      window.location.href = finalRedirectUrl;
    });

    function openCheckout() {
      document.getElementById('statusText').innerText = "Processing Payment...";
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('retryBtn').style.display = 'none';
      rzp1.open();
    }

    // Auto trigger on page load
    window.onload = function() {
      setTimeout(openCheckout, 300);
    };
  </script>
</body>
</html>
    `;

    return new Response(htmlContent, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err) {
    console.error('Error rendering checkout page:', err);
    return new Response(`<h2>Internal Error: ${err.message}</h2>`, { status: 500 });
  }
}
