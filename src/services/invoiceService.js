import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Indian GST State to Code Mapping (Standard GSTIN State Codes)
export const GST_STATE_CODES = {
  'JAMMU AND KASHMIR': '01',
  'HIMACHAL PRADESH': '02',
  'PUNJAB': '03',
  'CHANDIGARH': '04',
  'UTTARAKHAND': '05',
  'HARYANA': '06',
  'DELHI': '07',
  'RAJASTHAN': '08',
  'UTTAR PRADESH': '09',
  'BIHAR': '10',
  'SIKKIM': '11',
  'ARUNACHAL PRADESH': '12',
  'NAGALAND': '13',
  'MANIPUR': '14',
  'MIZORAM': '15',
  'TRIPURA': '16',
  'MEGHALAYA': '17',
  'ASSAM': '18',
  'WEST BENGAL': '19',
  'JHARKHAND': '20',
  'ODISHA': '21',
  'CHHATTISGARH': '22',
  'MADHYA PRADESH': '23',
  'GUJARAT': '24',
  'DAMAN AND DIU': '25',
  'DADRA AND NAGAR HAVELI': '26',
  'MAHARASHTRA': '27',
  'ANDHRA PRADESH': '37',
  'KARNATAKA': '29',
  'GOA': '30',
  'LAKSHADWEEP': '31',
  'KERALA': '32',
  'TAMIL NADU': '33',
  'PUDUCHERRY': '34',
  'ANDAMAN AND NICOBAR ISLANDS': '35',
  'TELANGANA': '36',
  'LADAKH': '38',
};

export function getStateCode(stateName) {
  if (!stateName || typeof stateName !== 'string') return '27'; // Default to Maharashtra
  const cleaned = stateName.trim().toUpperCase();
  return GST_STATE_CODES[cleaned] || '27';
}

// Convert numbers into Indian Rupees in words
function numberToWordsINR(amount) {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'Zero Rupees Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const twoDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensMultiple = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(num) {
    if (num === 0) return '';
    if (num < 10) return singleDigits[num];
    if (num < 20) return twoDigits[num - 10];
    return tensMultiple[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + singleDigits[num % 10] : '');
  }

  function convertThreeDigits(num) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    let res = '';
    if (hundreds > 0) res += singleDigits[hundreds] + ' Hundred';
    if (remainder > 0) res += (res ? ' and ' : '') + convertTwoDigits(remainder);
    return res;
  }

  let crore = Math.floor(rounded / 10000000);
  let remainder = rounded % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder %= 100000;
  let thousand = Math.floor(remainder / 1000);
  let hundreds = remainder % 1000;

  let words = '';
  if (crore > 0) words += convertThreeDigits(crore) + ' Crore ';
  if (lakh > 0) words += convertThreeDigits(lakh) + ' Lakh ';
  if (thousand > 0) words += convertThreeDigits(thousand) + ' Thousand ';
  if (hundreds > 0) words += convertThreeDigits(hundreds);

  return 'INR ' + words.trim() + ' Only';
}

class InvoiceService {
  /**
   * Generates a sequential, audit-compliant Tax Invoice Number (CGST Rule 46: Max 16 characters)
   * Format: BV/YY-YY/XXXXX (e.g., BV/26-27/00001 -> 14 characters)
   */
  generateInvoiceNumber(sequenceIndex = 1) {
    const date = new Date();
    const currentYear = date.getFullYear();
    const nextYear = currentYear + 1;
    const fyCode = `${String(currentYear).slice(-2)}-${String(nextYear).slice(-2)}`;
    const paddedIndex = String(sequenceIndex).padStart(5, '0');
    // Strictly <= 16 characters as mandated by GST Rule 46(b)
    return `BV/${fyCode}/${paddedIndex}`;
  }

  /**
   * Generates GST Compliant PDF Tax Invoice (Rule 46 of CGST Act 2017)
   */
  async generateTaxInvoicePdf({ transaction, user }) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size: 595 x 842 pt
    const { width, height } = page.getSize();

    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Color Palette
    const primaryColor = rgb(0.98, 0.14, 0.40); // BariVivah Rose #FB2467
    const darkText = rgb(0.12, 0.12, 0.14);
    const grayText = rgb(0.40, 0.40, 0.45);
    const lightGray = rgb(0.94, 0.94, 0.96);
    const borderColor = rgb(0.85, 0.85, 0.88);
    const white = rgb(1, 1, 1);

    const margin = 36;
    let cursorY = height - margin;

    // Company / Supplier Details (from Environment or Config)
    const companyName = process.env.COMPANY_LEGAL_NAME || 'BariVivah Matrimony Services';
    const companyGstin = process.env.COMPANY_GSTIN || '27AABCU9603R1ZM';
    const companyState = process.env.COMPANY_STATE || 'Maharashtra';
    const companyStateCode = process.env.COMPANY_STATE_CODE || '27';
    const companyAddress = process.env.COMPANY_ADDRESS || 'Mumbai, Maharashtra, India - 400001';
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@barivivah.in';

    // Customer Details
    const customerName = transaction.billingDetails?.customerName || user?.name || user?.fullName || 'Valued Member';
    const customerEmail = transaction.billingDetails?.customerEmail || user?.email || 'N/A';
    const customerPhone = transaction.billingDetails?.customerPhone || user?.phone || 'N/A';
    const customerState = transaction.billingDetails?.billingState || user?.state || companyState;
    const customerStateCode = transaction.billingDetails?.billingStateCode || getStateCode(customerState);
    const customerGstin = transaction.billingDetails?.customerGstin || 'Unregistered / B2C';

    const invoiceNumber = transaction.invoiceDetails?.invoiceNumber || transaction.receipt || `INV-${transaction.transactionId}`;
    const invoiceDate = transaction.capturedAt ? new Date(transaction.capturedAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // Tax Details
    const gst = transaction.gstBreakdown || {};
    const baseAmount = gst.baseAmount || transaction.amount || 0;
    const cgst = gst.cgst || 0;
    const sgst = gst.sgst || 0;
    const igst = gst.igst || 0;
    const totalTax = gst.totalTax || (cgst + sgst + igst);
    const totalAmount = gst.totalAmount || (baseAmount + totalTax);
    const sacCode = gst.sacCode || '998599';
    const isIntraState = cgst > 0 || sgst > 0;

    // Load and embed BariVivah TM Logo
    let logoImage = null;
    const possibleLogoPaths = [
      path.join(process.cwd(), 'public', 'logo_header2.png'),
      path.join(process.cwd(), 'Barivivah-bcknd', 'BariVivah-Bcakend', 'public', 'logo_header2.png'),
      path.join(process.cwd(), '..', 'public', 'logo_header2.png'),
      path.join(process.cwd(), '..', 'Mobileapp', 'BariVivah-App', 'assets', 'images', 'logo_header2.png'),
    ];
    for (const p of possibleLogoPaths) {
      if (fs.existsSync(p)) {
        try {
          const logoBytes = fs.readFileSync(p);
          logoImage = await pdfDoc.embedPng(logoBytes);
          break;
        } catch (e) {
          console.warn('Failed to embed logo from', p, e);
        }
      }
    }

    // 1. TOP HEADER & BRANDING
    const headerHeight = 64;
    page.drawRectangle({
      x: margin,
      y: cursorY - headerHeight,
      width: width - (2 * margin),
      height: headerHeight,
      color: lightGray,
    });

    page.drawText('INVOICE BILL', {
      x: margin + 14,
      y: cursorY - 30,
      size: 18,
      font: boldFont,
      color: primaryColor,
    });



    if (logoImage) {
      const logoW = 115;
      const logoH = 43.125; // Maintain 2048x768 aspect ratio
      const logoX = width - margin - logoW - 18;
      const logoY = cursorY - 54;
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY,
        width: logoW,
        height: logoH,
      });

      // TM Badge
      page.drawText('TM', {
        x: logoX + logoW - 4,
        y: logoY + logoH - 13,
        size: 6,
        font: boldFont,
        color: rgb(0.28, 0.33, 0.41),
      });
    } else {
      page.drawText('BariVivah™', {
        x: width - margin - 120,
        y: cursorY - 36,
        size: 15,
        font: boldFont,
        color: darkText,
      });
    }

    cursorY -= (headerHeight + 15);

    // 2. SUPPLIER & INVOICE META ROW
    const colW = (width - (2 * margin) - 16) / 2;

    // Left Box: Supplier Details
    page.drawRectangle({
      x: margin,
      y: cursorY - 110,
      width: colW,
      height: 110,
      borderColor: borderColor,
      borderWidth: 1,
    });

    page.drawText('SOLD BY / SUPPLIER:', {
      x: margin + 10,
      y: cursorY - 18,
      size: 9,
      font: boldFont,
      color: primaryColor,
    });

    page.drawText(companyName, {
      x: margin + 10,
      y: cursorY - 34,
      size: 10,
      font: boldFont,
      color: darkText,
    });

    page.drawText(`${companyAddress}`, {
      x: margin + 10,
      y: cursorY - 48,
      size: 8.5,
      font: regularFont,
      color: grayText,
    });

    page.drawText(`State: ${companyState} (Code: ${companyStateCode})`, {
      x: margin + 10,
      y: cursorY - 62,
      size: 8.5,
      font: regularFont,
      color: darkText,
    });

    page.drawText(`GSTIN: ${companyGstin}`, {
      x: margin + 10,
      y: cursorY - 76,
      size: 8.5,
      font: boldFont,
      color: darkText,
    });

    page.drawText(`Support: ${supportEmail}`, {
      x: margin + 10,
      y: cursorY - 90,
      size: 8,
      font: regularFont,
      color: grayText,
    });

    // Right Box: Invoice Meta & Billed To
    const rightColX = margin + colW + 16;
    page.drawRectangle({
      x: rightColX,
      y: cursorY - 110,
      width: colW,
      height: 110,
      borderColor: borderColor,
      borderWidth: 1,
    });

    page.drawText('INVOICE DETAILS & BILLED TO:', {
      x: rightColX + 10,
      y: cursorY - 18,
      size: 9,
      font: boldFont,
      color: primaryColor,
    });

    page.drawText(`Invoice No: ${invoiceNumber}`, {
      x: rightColX + 10,
      y: cursorY - 34,
      size: 9.5,
      font: boldFont,
      color: darkText,
    });

    page.drawText(`Date of Issue: ${invoiceDate}`, {
      x: rightColX + 10,
      y: cursorY - 48,
      size: 8.5,
      font: regularFont,
      color: darkText,
    });

    page.drawText(`Billed To: ${customerName}`, {
      x: rightColX + 10,
      y: cursorY - 62,
      size: 9,
      font: boldFont,
      color: darkText,
    });

    page.drawText(`Phone: ${customerPhone} | Email: ${customerEmail}`, {
      x: rightColX + 10,
      y: cursorY - 76,
      size: 8,
      font: regularFont,
      color: grayText,
    });

    page.drawText(`Place of Supply: ${customerState} (Code: ${customerStateCode})`, {
      x: rightColX + 10,
      y: cursorY - 90,
      size: 8.5,
      font: boldFont,
      color: darkText,
    });

    cursorY -= 130;

    // 3. SERVICE LINE ITEM TABLE (No SAC Code Column)
    const tableW = width - (2 * margin);
    const headerH = 24;

    page.drawRectangle({
      x: margin,
      y: cursorY - headerH,
      width: tableW,
      height: headerH,
      color: lightGray,
      borderColor: borderColor,
      borderWidth: 1,
    });

    // Header Titles
    page.drawText('S.No', { x: margin + 10, y: cursorY - 16, size: 8.5, font: boldFont, color: darkText });
    page.drawText('Service Description', { x: margin + 45, y: cursorY - 16, size: 8.5, font: boldFont, color: darkText });
    page.drawText('Taxable Value', { x: margin + 310, y: cursorY - 16, size: 8.5, font: boldFont, color: darkText });
    page.drawText('GST Rate', { x: margin + 395, y: cursorY - 16, size: 8.5, font: boldFont, color: darkText });
    page.drawText('Total (INR)', { x: width - margin - 75, y: cursorY - 16, size: 8.5, font: boldFont, color: darkText });

    cursorY -= headerH;

    // Row Item
    const rowH = 45;
    page.drawRectangle({
      x: margin,
      y: cursorY - rowH,
      width: tableW,
      height: rowH,
      borderColor: borderColor,
      borderWidth: 1,
    });

    const planName = transaction.planSnapshot?.name || 'BariVivah Premium Membership Plan';

    page.drawText('1', { x: margin + 14, y: cursorY - 20, size: 9, font: regularFont, color: darkText });
    page.drawText(planName, { x: margin + 45, y: cursorY - 18, size: 9, font: boldFont, color: darkText });
    page.drawText('Online Matrimonial & Matchmaking Services', { x: margin + 45, y: cursorY - 32, size: 7.5, font: regularFont, color: grayText });
    page.drawText(`INR ${baseAmount.toFixed(2)}`, { x: margin + 310, y: cursorY - 24, size: 9, font: regularFont, color: darkText });
    page.drawText('18% GST', { x: margin + 395, y: cursorY - 24, size: 9, font: regularFont, color: darkText });
    page.drawText(`INR ${totalAmount.toFixed(2)}`, { x: width - margin - 75, y: cursorY - 24, size: 9.5, font: boldFont, color: darkText });

    cursorY -= rowH + 15;

    // 4. TAX BREAKDOWN SUMMARY CARD
    const summaryCardW = 260;
    const summaryCardX = width - margin - summaryCardW;

    page.drawRectangle({
      x: summaryCardX,
      y: cursorY - 120,
      width: summaryCardW,
      height: 120,
      color: white,
      borderColor: borderColor,
      borderWidth: 1,
    });

    let sumY = cursorY - 20;

    // Taxable Value
    page.drawText('Taxable Value (Base Price):', { x: summaryCardX + 12, y: sumY, size: 8.5, font: regularFont, color: darkText });
    page.drawText(`INR ${baseAmount.toFixed(2)}`, { x: summaryCardX + summaryCardW - 75, y: sumY, size: 8.5, font: regularFont, color: darkText });
    sumY -= 18;

    if (isIntraState) {
      page.drawText('CGST (9.00%):', { x: summaryCardX + 12, y: sumY, size: 8.5, font: regularFont, color: darkText });
      page.drawText(`INR ${cgst.toFixed(2)}`, { x: summaryCardX + summaryCardW - 75, y: sumY, size: 8.5, font: regularFont, color: darkText });
      sumY -= 16;

      page.drawText('SGST (9.00%):', { x: summaryCardX + 12, y: sumY, size: 8.5, font: regularFont, color: darkText });
      page.drawText(`INR ${sgst.toFixed(2)}`, { x: summaryCardX + summaryCardW - 75, y: sumY, size: 8.5, font: regularFont, color: darkText });
      sumY -= 18;
    } else {
      page.drawText('IGST (18.00%):', { x: summaryCardX + 12, y: sumY, size: 8.5, font: regularFont, color: darkText });
      page.drawText(`INR ${igst.toFixed(2)}`, { x: summaryCardX + summaryCardW - 75, y: sumY, size: 8.5, font: regularFont, color: darkText });
      sumY -= 20;
    }

    // Divider
    page.drawLine({
      start: { x: summaryCardX + 10, y: sumY + 4 },
      end: { x: summaryCardX + summaryCardW - 10, y: sumY + 4 },
      color: borderColor,
      thickness: 1,
    });

    // Total Amount Payable
    page.drawText('Total Amount Paid:', { x: summaryCardX + 12, y: sumY - 14, size: 10, font: boldFont, color: primaryColor });
    page.drawText(`INR ${totalAmount.toFixed(2)}`, { x: summaryCardX + summaryCardW - 85, y: sumY - 14, size: 10.5, font: boldFont, color: primaryColor });

    // Left Notes / Payment Meta
    page.drawText(`Payment Gateway: Razorpay`, { x: margin, y: cursorY - 20, size: 8.5, font: boldFont, color: darkText });
    page.drawText(`Transaction ID: ${transaction.transactionId}`, { x: margin, y: cursorY - 34, size: 8, font: regularFont, color: grayText });
    if (transaction.razorpayPaymentId) {
      page.drawText(`Payment ID: ${transaction.razorpayPaymentId}`, { x: margin, y: cursorY - 48, size: 8, font: regularFont, color: grayText });
    }
    page.drawText(`Reverse Charge Mechanism (RCM): No`, { x: margin, y: cursorY - 62, size: 8, font: regularFont, color: grayText });

    cursorY -= 135;

    // Amount in words
    const inWords = numberToWordsINR(totalAmount);
    page.drawRectangle({
      x: margin,
      y: cursorY - 26,
      width: width - (2 * margin),
      height: 26,
      color: lightGray,
    });

    page.drawText(`Amount in Words: ${inWords}`, {
      x: margin + 12,
      y: cursorY - 17,
      size: 8.5,
      font: boldFont,
      color: darkText,
    });

    cursorY -= 60;

    // 5. SIGNATORY / FOOTER
    page.drawText(`For ${companyName}`, {
      x: width - margin - 150,
      y: cursorY,
      size: 9,
      font: boldFont,
      color: darkText,
    });

    page.drawText('(Authorized Signatory / Digitally Generated)', {
      x: width - margin - 190,
      y: cursorY - 24,
      size: 7.5,
      font: regularFont,
      color: grayText,
    });

    page.drawText('This is a computer-generated tax invoice and requires no physical signature.', {
      x: margin,
      y: margin + 10,
      size: 7.5,
      font: regularFont,
      color: grayText,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}

export default new InvoiceService();
