import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

// Helper: Draw filled rounded rectangle with optional border in pdf-lib
function drawRoundedRectangle(page, { x, y, width, height, radius = 12, color, borderColor, borderWidth = 1 }) {
  const r = Math.min(radius, width / 2, height / 2);
  page.drawRectangle({ x: x + r, y, width: width - (2 * r), height, color, borderColor: color });
  page.drawRectangle({ x, y: y + r, width, height: height - (2 * r), color, borderColor: color });
  page.drawCircle({ x: x + r, y: y + r, size: r, color });
  page.drawCircle({ x: x + width - r, y: y + r, size: r, color });
  page.drawCircle({ x: x + r, y: y + height - r, size: r, color });
  page.drawCircle({ x: x + width - r, y: y + height - r, size: r, color });

  if (borderColor) {
    page.drawLine({ start: { x: x + r, y: y + height }, end: { x: x + width - r, y: y + height }, thickness: borderWidth, color: borderColor });
    page.drawLine({ start: { x: x + r, y }, end: { x: x + width - r, y }, thickness: borderWidth, color: borderColor });
    page.drawLine({ start: { x, y: y + r }, end: { x, y: y + height - r }, thickness: borderWidth, color: borderColor });
    page.drawLine({ start: { x: x + width, y: y + r }, end: { x: x + width, y: y + height - r }, thickness: borderWidth, color: borderColor });
  }
}

// Helper: Wrap text into lines fitting specified maximum width
function wrapText(text, font, fontSize, maxW) {
  if (text === null || text === undefined || text === '') return ['Not specified'];
  const words = text.toString().split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > maxW && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines.length > 0 ? lines : ['Not specified'];
}

export async function POST(request) {
  try {
    const { userData } = await request.json();

    if (!userData) {
      return NextResponse.json({ success: false, message: 'userData is required' }, { status: 400 });
    }

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const width = 595; // A4 standard width
    const height = 842; // A4 standard height
    const page = pdfDoc.addPage([width, height]);

    // Color Palette matching design screenshot
    const coralPink = rgb(0.98, 0.35, 0.40);    // #FB5263 (Accent line & badge color)
    const softPink = rgb(0.99, 0.93, 0.94);     // #FDECEF (Light bio background)
    const darkTitle = rgb(0.12, 0.16, 0.23);    // #1E293B (Dark bold section headers & values)
    const labelColor = rgb(0.40, 0.45, 0.52);   // #64748B (Muted grey label text)
    const bodyColor = rgb(0.20, 0.25, 0.33);    // #334155 (Bio & content body text)
    const pageBorderColor = rgb(0.85, 0.88, 0.92); // #D8E0EA (Clean outer page boundary)
    const linkBlue = rgb(0.01, 0.52, 0.78);     // #0284C7 (Profile link color)
    const white = rgb(1, 1, 1);

    // Helper: Sanitize text for PDF standard fonts
    const sanitizeText = (text) => {
      if (text === null || text === undefined) return '';
      return text.toString()
        .replace(/₹/g, 'Rs.')
        .replace(/[^\x00-\x7F]/g, '')
        .trim();
    };

    // Helper: Format date as 'DD-MMM-YYYY' matching screenshot
    const formatDate = (dateVal) => {
      if (!dateVal) return 'Not specified';
      if (typeof dateVal === 'string' && dateVal.includes('/')) return dateVal;
      try {
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return dateVal.toString();
        const day = String(d.getDate()).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      } catch (e) {
        return dateVal.toString();
      }
    };

    const u = userData || {};

    // Profile ID extraction
    const rawId = u.profileId || u.customId || u.id || u._id || Date.now();
    const shortId = rawId.toString().slice(-6).toUpperCase();
    const candidateProfileId = u.profileId || u.customId || `BV-${shortId}`;
    const profileUrl = `https://barivivah.in/profile?profileid=${candidateProfileId}`;

    // Field extractions with robust fallbacks
    const fullName = u.name || u.fullName || u.displayName || 'Candidate Member';
    const dobStr = formatDate(u.dob || u.dateOfBirth || u.birthDate);
    const heightStr = u.height || u.heightInFt || 'Not specified';
    const maritalStatus = u.maritalStatus || u.marital || 'Never Married';
    const emailStr = u.email || u.emailId || 'Not specified';
    const phoneStr = u.phone || u.mobile || u.contactNumber || u.phoneNumber || 'Not specified';
    const bloodGroup = u.bloodGroup || u.blood || u.blood_group || 'Not specified';

    const religionStr = u.religion || 'Hindu';
    const communityStr = u.caste || u.community || 'Bari';
    const subCasteStr = u.subcaste || u.subCaste || u.sect || 'Not specified';
    const gotraStr = u.gotra || u.gothra || 'Not specified';
    const motherTongueStr = u.motherTongue || u.language || 'Hindi';
    const manglikStr = u.manglik || u.mangal || 'No';

    const livingInStr = u.currentAddress || [u.currentCity || u.city, u.state].filter(Boolean).join(', ') || 'Not specified';
    const permanentAddrStr = u.permanentAddress || u.parentResidenceCity || u.nativePlace || u.nativeCity || 'Not specified';
    const educationStr = u.education || u.highestEducation || u.degree || 'Not specified';
    const collegeStr = u.college || u.university || u.institute || u.collegeAttended || 'Not specified';
    const workSectorStr = u.workSector || u.employmentType || 'Not specified';
    const occupationStr = u.occupation || u.profession || u.jobTitle || 'Not specified';
    const incomeStr = u.income || u.annualIncome || u.salary || 'Not specified';

    const fatherName = u.fatherName || u.father || 'Not specified';
    const fatherOccupation = u.fatherOccupation || u.parentOccupation || 'Not specified';
    const motherName = u.motherName || u.mother || 'Not specified';
    const motherOccupation = u.motherOccupation || 'Homemaker';

    const brothers = u.brothers !== undefined && u.brothers !== null && u.brothers !== '' ? Number(u.brothers) : 0;
    const marriedBrothers = u.marriedBrothers ? Number(u.marriedBrothers) : 0;
    const sisters = u.sisters !== undefined && u.sisters !== null && u.sisters !== '' ? Number(u.sisters) : 0;
    const marriedSisters = u.marriedSisters ? Number(u.marriedSisters) : 0;
    const siblingsStr = `${brothers} Brother(s) (${marriedBrothers} Married), ${sisters} Sister(s) (${marriedSisters} Married)`;

    const mamaSurname = u.mamaSurname || u.maternalGothra || u.mamekul || 'Not specified';
    const mamaContact = u.mamaContact || u.maternalContact || 'Not specified';
    const nativePlaceStr = u.nativePlace || u.nativeCity || u.nativeDistrict || u.parentResidenceCity || 'Not specified';

    const bio = u.aboutMe || u.bio || u.profileSummary || u.about || u.description ||
      'I am looking for a partner who shares similar values, is understanding, supportive, and respects family traditions.';

    // ==========================================
    // 1. CLEAN OUTER PAGE BORDER (Matching Screenshot)
    // ==========================================
    const outerMargin = 18;
    page.drawRectangle({
      x: outerMargin,
      y: outerMargin,
      width: width - (2 * outerMargin),
      height: height - (2 * outerMargin),
      borderColor: pageBorderColor,
      borderWidth: 1,
      color: white,
    });

    // ==========================================
    // 2. LEFT COLUMN (Photo Card + Auto-Fit Bio Card)
    // ==========================================
    const leftMargin = 34;
    const leftColW = 195;
    const contentTopY = height - 58; // Generous space from the top page border

    // A) TOP PHOTO CARD
    const photoCardH = 185;
    const photoCardY = contentTopY - photoCardH;

    // Fetch and prepare profile photo if available
    let profileImage = null;
    const photoUrl = u.profilePhoto || u.photo || (u.photos && u.photos[0]?.url) || (u.photos && u.photos[0]);
    if (photoUrl) {
      try {
        const response = await fetch(photoUrl);
        if (response.ok) {
          const imageBuffer = await response.arrayBuffer();
          try {
            profileImage = await pdfDoc.embedJpg(imageBuffer);
          } catch (jpgErr) {
            try {
              profileImage = await pdfDoc.embedPng(imageBuffer);
            } catch (pngErr) {}
          }
        }
      } catch (err) {}
    }

    if (profileImage) {
      // Draw clean frame without pink background
      drawRoundedRectangle(page, {
        x: leftMargin,
        y: photoCardY,
        width: leftColW,
        height: photoCardH,
        radius: 18,
        color: white,
        borderColor: pageBorderColor,
        borderWidth: 1,
      });

      try {
        const padding = 3;
        const scaled = profileImage.scaleToFit(leftColW - (2 * padding), photoCardH - (2 * padding));
        const imgX = leftMargin + padding + (leftColW - (2 * padding) - scaled.width) / 2;
        const imgY = photoCardY + padding + (photoCardH - (2 * padding) - scaled.height) / 2;

        page.drawImage(profileImage, {
          x: imgX,
          y: imgY,
          width: scaled.width,
          height: scaled.height,
        });
      } catch (e) {}
    } else {
      // Fallback: Elegant initial monogram with coral pink background (when no photo is uploaded)
      drawRoundedRectangle(page, {
        x: leftMargin,
        y: photoCardY,
        width: leftColW,
        height: photoCardH,
        radius: 18,
        color: coralPink,
      });

      const initialChar = (fullName || 'B').charAt(0).toUpperCase();
      const initSize = 110;
      const initW = boldFont.widthOfTextAtSize(initialChar, initSize);
      page.drawText(initialChar, {
        x: leftMargin + (leftColW - initW) / 2,
        y: photoCardY + (photoCardH - initSize) / 2 + 10,
        size: initSize,
        font: boldFont,
        color: white,
      });
    }

    // B) BOTTOM SOFT PINK BIO CARD (Auto-fits to bio length)
    const rawBio = sanitizeText(bio);
    const quoteText = `“${rawBio}”`;
    const bioLines = wrapText(quoteText, regularFont, 9, leftColW - 32);

    const nameSectionH = 16 + 10 + 2.5 + 14;
    const bioTextH = bioLines.length * 13.5;
    const bioCardH = Math.max(85, nameSectionH + bioTextH + 26);
    const bioCardY = photoCardY - 14 - bioCardH;

    drawRoundedRectangle(page, {
      x: leftMargin,
      y: bioCardY,
      width: leftColW,
      height: bioCardH,
      radius: 18,
      color: softPink,
    });

    let bioCurY = bioCardY + bioCardH - 24;

    // Candidate Name
    const cleanName = sanitizeText(fullName);
    page.drawText(cleanName, {
      x: leftMargin + 16,
      y: bioCurY,
      size: 16,
      font: boldFont,
      color: darkTitle,
      maxWidth: leftColW - 32,
    });
    bioCurY -= 10;

    // Accent line under Name (Matching screenshot)
    page.drawRectangle({
      x: leftMargin + 16,
      y: bioCurY,
      width: 28,
      height: 2.5,
      color: coralPink,
    });
    bioCurY -= 16;

    // About Me Quote Text
    bioLines.forEach((line) => {
      page.drawText(line, {
        x: leftMargin + 16,
        y: bioCurY,
        size: 9,
        font: regularFont,
        color: bodyColor,
      });
      bioCurY -= 13.5;
    });

    // ==========================================
    // 3. RIGHT COLUMN (Clean Key-Value Sections with Standard Spacing)
    // ==========================================
    const rightColX = leftMargin + leftColW + 26; // 253
    const labelWidth = 118;
    const colonX = rightColX + labelWidth;
    const valueX = colonX + 12;
    const maxValueW = width - outerMargin - valueX - 16;

    let rightCurY = contentTopY - 2;

    // Helper: Render section with title + accent underline + all key-value rows
    const renderSection = (title, fields) => {
      // Section Title
      page.drawText(title, {
        x: rightColX,
        y: rightCurY,
        size: 12.5,
        font: boldFont,
        color: darkTitle,
      });

      // Accent underline under title
      page.drawRectangle({
        x: rightColX,
        y: rightCurY - 5,
        width: 28,
        height: 2.5,
        color: coralPink,
      });

      rightCurY -= 20;

      // Render all key-value rows
      fields.forEach(([label, value]) => {
        const valClean = sanitizeText(value || 'Not specified');
        const valLines = wrapText(valClean, boldFont, 9.5, maxValueW);

        // Label
        page.drawText(label, {
          x: rightColX,
          y: rightCurY,
          size: 9.5,
          font: regularFont,
          color: labelColor,
          maxWidth: labelWidth - 4,
        });

        // Colon
        page.drawText(':', {
          x: colonX,
          y: rightCurY,
          size: 9.5,
          font: boldFont,
          color: darkTitle,
        });

        // Value (Multi-line supported)
        let lineY = rightCurY;
        valLines.forEach((l) => {
          page.drawText(l, {
            x: valueX,
            y: lineY,
            size: 9.5,
            font: boldFont,
            color: darkTitle,
          });
          lineY -= 12.5;
        });

        const rowHeight = Math.max(16.5, valLines.length * 12.5 + 4);
        rightCurY -= rowHeight;
      });

      rightCurY -= 16; // Comfortable breathing room between sections
    };

    // 1) Basic Details
    renderSection('Basic Details', [
      ['Date of Birth', dobStr],
      ['Height', heightStr],
      ['Marital Status', maritalStatus],
      ['Blood Group', bloodGroup],
      ['Email ID', emailStr],
      ['Contact No.', phoneStr],
    ]);

    // 2) Religious Background
    renderSection('Religious Background', [
      ['Religion', religionStr],
      ['Community', communityStr],
      ['Sub-caste', subCasteStr],
      ['Gotra', gotraStr],
      ['Mother Tongue', motherTongueStr],
      ['Manglik', manglikStr],
    ]);

    // 3) Location, Education & Career
    renderSection('Location, Education & Career', [
      ['Living in', livingInStr],
      ['Permanent Address', permanentAddrStr],
      ['Highest Qualification', educationStr],
      ['College Attended', collegeStr],
      ['Work Sector', workSectorStr],
      ['Occupation', occupationStr],
      ['Income', incomeStr],
    ]);

    // 4) Family Details
    renderSection('Family Details', [
      ['Father\'s Name', fatherName],
      ['Father\'s Occupation', fatherOccupation],
      ['Mother\'s Name', motherName],
      ['Mother\'s Occupation', motherOccupation],
      ['Brothers & Sisters', siblingsStr],
      ['Mama\'s Surname', mamaSurname],
      ['Mama\'s Contact', mamaContact],
      ['Native Place', nativePlaceStr],
    ]);

    // ==========================================
    // 4. BOTTOM OF PAGE: PROFILE LINK & BRANDING
    // ==========================================
    const footerY = 25;

    // Link Text at bottom (as requested: "and the link to the usersprofile it should at the bottom of the page")
    page.drawText('Click here to view my BariVivah Profile: ', {
      x: leftMargin,
      y: footerY,
      size: 8.5,
      font: boldFont,
      color: darkTitle,
    });

    const prefixW = boldFont.widthOfTextAtSize('Click here to view my BariVivah Profile: ', 8.5);
    page.drawText(profileUrl, {
      x: leftMargin + prefixW,
      y: footerY,
      size: 8.5,
      font: boldFont,
      color: linkBlue,
    });

    // Bottom Right Branding: BariVivah Trademark Logo / Text
    let logoDrawn = false;
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const logoPath = path.join(publicDir, 'logo_header2.png');
      if (fs.existsSync(logoPath)) {
        const logoBytes = fs.readFileSync(logoPath);
        const logoImg = await pdfDoc.embedPng(logoBytes);
        const scaled = logoImg.scaleToFit(85, 24);
        page.drawImage(logoImg, {
          x: width - outerMargin - scaled.width - 16,
          y: footerY - 4,
          width: scaled.width,
          height: scaled.height,
        });
        logoDrawn = true;
      }
    } catch (e) {}

    if (!logoDrawn) {
      const brandStr = 'barivivah.in';
      const brandW = boldFont.widthOfTextAtSize(brandStr, 11);
      page.drawText(brandStr, {
        x: width - outerMargin - brandW - 16,
        y: footerY,
        size: 11,
        font: boldFont,
        color: coralPink,
      });
    }

    // Output Base64 PDF Response
    const pdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');
    const sanitizedName = (fullName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `BariVivah_Biodata_${sanitizedName}.pdf`;

    return NextResponse.json({
      success: true,
      pdf: base64Pdf,
      fileName,
      message: 'Candidate Biodata PDF generated successfully',
      profileId: candidateProfileId,
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'PDF Generation Failed' },
      { status: 500 }
    );
  }
}