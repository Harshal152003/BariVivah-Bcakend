import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import PaymentTransaction from '@/models/PaymentTransaction';
import User from '@/models/User';
import { createToken } from '@/lib/auth';

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

    if (!transaction || !transaction.userId) {
      return new Response('<h2>Error: Invalid or expired payment order</h2>', {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const user = await User.findById(transaction.userId);
    const rawPhone = user?.phone || user?.phoneNumber || '';
    const userPhone = rawPhone.replace(/\+91|\s/g, '').trim();
    const userEmail = user?.email || '';
    const userName = user?.name || 'BariVivah Member';

    const amountInPaise = Math.round(transaction.amount * 100);
    const planName = transaction.planSnapshot?.name || 'BariVivah Premium';
    const userId = transaction.userId ? transaction.userId.toString() : '';
    const authToken = userId ? createToken(userId) : '';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>BariVivah - Secure Checkout</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #F8FAFC;
      color: #0F172A;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px 16px;
      -webkit-font-smoothing: antialiased;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 24px;
      padding: 28px 24px;
      max-width: 380px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
    }
    .logo-container {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
    }
    .brand-logo {
      height: 40px;
      width: auto;
      max-width: 180px;
      object-fit: contain;
    }
    .tm-badge {
      position: absolute;
      top: 0px;
      right: -8px;
      font-size: 8px;
      font-weight: 700;
      color: #475569;
      letter-spacing: 0.5px;
      font-family: sans-serif;
    }
    .plan-badge {
      display: inline-block;
      background: #FFF1F2;
      color: #E11D48;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 12px;
      margin-bottom: 6px;
      border: 1px solid #FFE4E6;
    }
    .plan {
      font-size: 17px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 2px;
    }
    .price-wrap {
      margin: 8px 0 16px;
    }
    .price {
      font-size: 32px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.5px;
    }
    .breakdown-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 12px 14px;
      margin: 0 0 14px;
      text-align: left;
      font-size: 12.5px;
      color: #64748B;
    }
    .breakdown-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .breakdown-row:last-child {
      margin-bottom: 0;
    }
    .breakdown-val {
      color: #0F172A;
      font-weight: 600;
    }
    .breakdown-divider {
      height: 1px;
      background-color: #E2E8F0;
      margin: 7px 0;
    }
    .breakdown-total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #0F172A;
      font-weight: 700;
    }
    .breakdown-total-val {
      color: #E11D48;
      font-weight: 800;
      font-size: 14.5px;
    }
    .security-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #ECFDF5;
      border: 1px solid #A7F3D0;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      color: #059669;
      margin-bottom: 12px;
    }
    .spinner {
      border: 3px solid #F1F5F9;
      border-top-color: #E11D48;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      animation: spin 0.85s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      margin: 14px auto 10px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .status {
      font-size: 13px;
      color: #64748B;
      font-weight: 500;
      line-height: 1.4;
    }
    .success-badge {
      margin: 10px auto;
      display: none;
    }
    .btn-action {
      background: #0F172A;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 16px;
      display: none;
      width: 100%;
      text-decoration: none;
    }
    .btn-retry {
      background: #F1F5F9;
      color: #0F172A;
      border: 1px solid #CBD5E1;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      margin-top: 12px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-container">
      <img src="/logo_header2.png" alt="BariVivah" class="brand-logo" onerror="this.style.display='none'; document.getElementById('textLogo').style.display='inline-block';" />
      <span id="textLogo" style="display:none; font-size:22px; font-weight:800; color:#E11D48;">BariVivah</span>
      <span class="tm-badge">TM</span>
    </div>

    <div class="plan-badge">Subscription</div>
    <div class="plan">${planName}</div>
    
    <div class="price-wrap">
      <span class="price">₹${transaction.amount}</span>
    </div>
    
    <div class="breakdown-box">
      <div class="breakdown-row">
        <span>Plan Base Price:</span>
        <span class="breakdown-val">₹${transaction.gstBreakdown?.baseAmount || transaction.amount}</span>
      </div>
      <div class="breakdown-row">
        <span>GST (18% SAC 998599):</span>
        <span class="breakdown-val">₹${transaction.gstBreakdown?.totalTax || 0}</span>
      </div>
      <div class="breakdown-divider"></div>
      <div class="breakdown-total-row">
        <span>Total Payable:</span>
        <span class="breakdown-total-val">₹${transaction.amount}</span>
      </div>
    </div>

    <div class="security-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      <span>256-Bit SSL Encrypted</span>
    </div>
    
    <div class="success-badge" id="successBadge">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>

    <div class="spinner" id="spinner"></div>
    <div class="status" id="statusText">Processing Payment...</div>

    <button class="btn-action" id="returnBtn" onclick="returnToApp()">Return to BariVivah App</button>
    <button class="btn-retry" id="retryBtn" onclick="openCheckout()">Retry Payment</button>
  </div>

  <script>
    let finalRedirectUrl = "${redirectUrl}";

    function returnToApp(payload) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(payload || { status: 'SUCCESS' }));
      } else {
        window.location.href = finalRedirectUrl;
      }
    }

    const options = {
      key: "${keyId}",
      amount: ${amountInPaise},
      currency: "${transaction.currency}",
      name: "BariVivah Matrimony",
      description: "${planName} Subscription",
      order_id: "${orderId}",
      prefill: {
        name: "${userName}",
        contact: "${userPhone}",
        email: "${userEmail}"
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
              'Authorization': 'Bearer ${authToken}'
            },
            body: JSON.stringify(returnPayload)
          });
          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('successBadge').style.display = 'block';
            document.getElementById('statusText').innerHTML = "<strong style='color:#10B981;'>Payment Verified & Subscription Activated!</strong><br>Your account has been upgraded.";
            document.getElementById('returnBtn').style.display = 'block';

            // Auto redirect / postMessage after 1.2 seconds
            setTimeout(function() {
              returnToApp(returnPayload);
            }, 1200);
            return;
          }
        } catch (e) {
          console.warn('Direct verify fetch failed, attempting redirect:', e);
        }

        // Fallback to app postMessage / redirect
        returnToApp(returnPayload);
      },
      modal: {
        ondismiss: function() {
          document.getElementById('statusText').innerText = "Payment cancelled by user.";
          document.getElementById('spinner').style.display = 'none';
          document.getElementById('retryBtn').style.display = 'inline-block';

          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'CANCELLED' }));
          } else {
            finalRedirectUrl = "${redirectUrl}?status=CANCELLED";
            window.location.href = finalRedirectUrl;
          }
        }
      }
    };

    const rzp1 = new Razorpay(options);

    rzp1.on('payment.failed', function (response){
      document.getElementById('statusText').innerText = "Payment Failed: " + (response.error.description || "Transaction failed");
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('retryBtn').style.display = 'inline-block';

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          status: 'FAILED',
          error: response.error?.description || 'Payment Failed'
        }));
      } else {
        finalRedirectUrl = "${redirectUrl}?status=FAILED&error=" + encodeURIComponent(response.error?.description || 'Payment Failed');
        window.location.href = finalRedirectUrl;
      }
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
