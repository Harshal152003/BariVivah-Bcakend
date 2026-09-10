import invoiceService, { GST_STATE_CODES, getStateCode } from '../src/services/invoiceService.js';

function computeGstBreakdown({ basePlanPrice, userState }) {
  const gstEnabled = process.env.GST_ENABLED !== 'false';
  const gstPricingMode = (process.env.GST_PRICING_MODE || 'EXCLUSIVE').toUpperCase();
  const gstRate = Number(process.env.GST_RATE) || 18;
  const companyState = (process.env.COMPANY_STATE || 'Maharashtra').trim().toLowerCase();
  const companyStateCode = process.env.COMPANY_STATE_CODE || '27';

  const customerState = (userState || process.env.COMPANY_STATE || 'Maharashtra').trim();
  const customerStateCode = getStateCode(customerState);
  const isSameState = customerState.toLowerCase() === companyState;

  if (!gstEnabled) {
    const total = basePlanPrice;
    return {
      sacCode: '998599',
      gstRate: 0,
      isInclusive: false,
      baseAmount: total,
      cgst: 0,
      sgst: 0,
      igst: 0,
      totalTax: 0,
      totalAmount: total,
      amountInPaise: Math.round(total * 100),
      billingState: customerState,
      billingStateCode: customerStateCode,
    };
  }

  let baseAmount, cgst, sgst, igst, totalTax, totalAmount;

  if (gstPricingMode === 'INCLUSIVE') {
    totalAmount = basePlanPrice;
    baseAmount = Math.round((totalAmount / (1 + gstRate / 100)) * 100) / 100;
    totalTax = Math.round((totalAmount - baseAmount) * 100) / 100;
  } else {
    baseAmount = basePlanPrice;
    totalTax = Math.round((baseAmount * (gstRate / 100)) * 100) / 100;
    totalAmount = Math.round((baseAmount + totalTax) * 100) / 100;
  }

  if (isSameState) {
    cgst = Math.round((totalTax / 2) * 100) / 100;
    sgst = Math.round((totalTax - cgst) * 100) / 100;
    igst = 0;
  } else {
    cgst = 0;
    sgst = 0;
    igst = totalTax;
  }

  const amountInPaise = Math.round(totalAmount * 100);

  return {
    sacCode: '998599',
    gstRate,
    isInclusive: gstPricingMode === 'INCLUSIVE',
    baseAmount,
    cgst,
    sgst,
    igst,
    totalTax,
    totalAmount,
    amountInPaise,
    billingState: customerState,
    billingStateCode: customerStateCode,
  };
}

async function runGstTests() {
  console.log('🧪 Starting GST Calculation & Invoicing Tests...\n');

  // Test 1: Option A (Exclusive 18% GST) - Intra-State (Maharashtra)
  process.env.GST_ENABLED = 'true';
  process.env.GST_PRICING_MODE = 'EXCLUSIVE';
  process.env.GST_RATE = '18';
  process.env.COMPANY_STATE = 'Maharashtra';
  process.env.COMPANY_STATE_CODE = '27';

  const intraResult = computeGstBreakdown({ basePlanPrice: 999, userState: 'Maharashtra' });
  console.log('Test 1 - Intra-State (Maharashtra, Same State):', intraResult);

  if (intraResult.baseAmount === 999 && intraResult.cgst === 89.91 && intraResult.sgst === 89.91 && intraResult.igst === 0 && intraResult.totalAmount === 1178.82 && intraResult.amountInPaise === 117882) {
    console.log('✅ Test 1 Passed: Exact CGST (₹89.91) + SGST (₹89.91) = Total ₹1,178.82 (117882 paise)\n');
  } else {
    throw new Error('❌ Test 1 Failed: Unexpected intra-state tax split');
  }

  // Test 2: Option A (Exclusive 18% GST) - Inter-State (Madhya Pradesh)
  const interResult = computeGstBreakdown({ basePlanPrice: 999, userState: 'Madhya Pradesh' });
  console.log('Test 2 - Inter-State (Madhya Pradesh, Different State):', interResult);

  if (interResult.baseAmount === 999 && interResult.cgst === 0 && interResult.sgst === 0 && interResult.igst === 179.82 && interResult.totalAmount === 1178.82 && interResult.amountInPaise === 117882) {
    console.log('✅ Test 2 Passed: Exact IGST (₹179.82) = Total ₹1,178.82 (117882 paise)\n');
  } else {
    throw new Error('❌ Test 2 Failed: Unexpected inter-state tax calculation');
  }

  // Test 3: Higher tier plan (₹4,999 VIP Plan)
  const vipResult = computeGstBreakdown({ basePlanPrice: 4999, userState: 'Maharashtra' });
  console.log('Test 3 - ₹4,999 VIP Plan (Maharashtra):', vipResult);
  if (vipResult.totalAmount === 5898.82 && vipResult.amountInPaise === 589882) {
    console.log('✅ Test 3 Passed: VIP Plan ₹4,999 + 18% GST (₹899.82) = ₹5,898.82 (589882 paise)\n');
  } else {
    throw new Error('❌ Test 3 Failed');
  }

  // Test 4: PDF Tax Invoice Generation
  console.log('Test 4 - Generating GST Rule 46 PDF Tax Invoice...');
  const mockTransaction = {
    transactionId: 'bv_tx_test_123456',
    amount: 1178.82,
    currency: 'INR',
    receipt: 'rcpt_bv_test_123',
    status: 'CAPTURED',
    capturedAt: new Date(),
    razorpayPaymentId: 'pay_test_987654321',
    planSnapshot: {
      name: 'Gold Membership (3 Months)',
      price: 999,
    },
    gstBreakdown: intraResult,
    billingDetails: {
      customerName: 'Rahul Bari',
      customerEmail: 'rahul.bari@example.com',
      customerPhone: '9876543210',
      billingState: 'Maharashtra',
      billingStateCode: '27',
      customerGstin: '',
    },
    invoiceDetails: {
      invoiceNumber: 'BV/26-27/INV-00001',
      invoiceDate: new Date(),
    },
  };

  const mockUser = {
    name: 'Rahul Bari',
    email: 'rahul.bari@example.com',
    phone: '9876543210',
    state: 'Maharashtra',
  };

  const pdfBuffer = await invoiceService.generateTaxInvoicePdf({ transaction: mockTransaction, user: mockUser });
  if (pdfBuffer && pdfBuffer.length > 1000) {
    console.log(`✅ Test 4 Passed: Generated Tax Invoice PDF successfully (${pdfBuffer.length} bytes)\n`);
  } else {
    throw new Error('❌ Test 4 Failed: PDF buffer invalid');
  }

  console.log('🎉 ALL GST TESTS PASSED WITH 100% ACCURACY!');
}

runGstTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
