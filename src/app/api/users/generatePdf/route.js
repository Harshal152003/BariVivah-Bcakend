import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

// Helper: Draw filled rounded rectangle with optional border in pdf-lib
function drawRoundedRectangle(page, { x, y, width, height, radius = 8, color, borderColor, borderWidth = 1 }) {
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

// Sleek Elegant Pink Badge Icons (Reduced Radius for Refined Look)
function drawBadgeIcon(page, cx, cy, type, { pinkPrimary, white }) {
  const badgeR = 9.5; // Reduced radius for sleek, proportional design
  page.drawCircle({ x: cx, y: cy, size: badgeR, color: pinkPrimary });

  try {
    if (type === 'mail') {
      page.drawRectangle({ x: cx - 4.5, y: cy - 3, width: 9, height: 6, color: white });
      page.drawLine({ start: { x: cx - 4.5, y: cy + 3 }, end: { x: cx, y: cy }, thickness: 0.8, color: pinkPrimary });
      page.drawLine({ start: { x: cx + 4.5, y: cy + 3 }, end: { x: cx, y: cy }, thickness: 0.8, color: pinkPrimary });
    } else if (type === 'phone') {
      page.drawRectangle({ x: cx - 4, y: cy - 3, width: 8, height: 6, color: white });
      page.drawRectangle({ x: cx - 1.5, y: cy - 0.8, width: 3, height: 3.8, color: pinkPrimary });
      page.drawCircle({ x: cx - 2.5, y: cy - 1.5, size: 1, color: white });
      page.drawCircle({ x: cx + 2.5, y: cy - 1.5, size: 1, color: white });
    } else if (type === 'person') {
      page.drawCircle({ x: cx, y: cy + 2.2, size: 2.8, color: white });
      page.drawRectangle({ x: cx - 4, y: cy - 4, width: 8, height: 4, color: white });
      page.drawCircle({ x: cx - 2.8, y: cy - 1.5, size: 1.2, color: white });
      page.drawCircle({ x: cx + 2.8, y: cy - 1.5, size: 1.2, color: white });
    } else if (type === 'family') {
      page.drawRectangle({ x: cx - 3.5, y: cy - 4, width: 7, height: 5, color: white });
      page.drawLine({ start: { x: cx - 5, y: cy + 0.8 }, end: { x: cx, y: cy + 4.8 }, thickness: 1.5, color: white });
      page.drawLine({ start: { x: cx + 5, y: cy + 0.8 }, end: { x: cx, y: cy + 4.8 }, thickness: 1.5, color: white });
      page.drawRectangle({ x: cx - 1.2, y: cy - 4, width: 2.4, height: 3.2, color: pinkPrimary });
    } else if (type === 'education') {
      page.drawLine({ start: { x: cx - 5.5, y: cy + 1.5 }, end: { x: cx, y: cy + 4.2 }, thickness: 1.5, color: white });
      page.drawLine({ start: { x: cx + 5.5, y: cy + 1.5 }, end: { x: cx, y: cy + 4.2 }, thickness: 1.5, color: white });
      page.drawLine({ start: { x: cx - 5.5, y: cy + 1.5 }, end: { x: cx, y: cy - 1.2 }, thickness: 1.5, color: white });
      page.drawLine({ start: { x: cx + 5.5, y: cy + 1.5 }, end: { x: cx, y: cy - 1.2 }, thickness: 1.5, color: white });
      page.drawRectangle({ x: cx - 3, y: cy - 3.8, width: 6, height: 2.5, color: white });
    } else {
      page.drawCircle({ x: cx, y: cy, size: 3, color: white });
    }
  } catch (e) {
    page.drawCircle({ x: cx, y: cy, size: 3, color: white });
  }
}

// Helper: Wrap text into lines fitting specified maximum width
function wrapText(text, font, fontSize, maxW) {
  if (text === null || text === undefined || text === '') return ['N/A'];
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
  return lines.length > 0 ? lines : ['N/A'];
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

    let page = pdfDoc.addPage([595, 842]); // A4 size: 595 x 842 pt
    const width = 595;
    const height = 842;
    const margin = 24;

    // Palette matching home screen header aesthetic
    const pinkPrimary = rgb(0.91, 0.12, 0.39); // #E91E63 (Vibrant Brand Pink)
    const pinkLight = rgb(0.99, 0.94, 0.96);   // #FDF2F8 (Soft Card Pink Tint)
    const pinkBorder = rgb(0.94, 0.76, 0.84);  // #F3CEE2 (Soft Pink Card Border)
    const darkText = rgb(0.12, 0.16, 0.22);    // #1F2937 (Bold Dark Headline & Value Text)
    const bodyText = rgb(0.22, 0.25, 0.32);    // #374151 (Dark Neutral Body Text)
    const labelText = rgb(0.35, 0.38, 0.45);   // #555555 (Field Label Gray Text)
    const white = rgb(1, 1, 1);

    // Helper: Sanitize text for PDF standard fonts
    const sanitizeText = (text) => {
      if (text === null || text === undefined) return '';
      return text.toString()
        .replace(/₹/g, 'Rs.')
        .replace(/[^\x00-\x7F]/g, '')
        .trim();
    };

    // Helper: Format date as 'DD MMM YYYY'
    const formatDate = (dateVal) => {
      if (!dateVal) return 'N/A';
      if (typeof dateVal === 'string' && dateVal.includes('/')) return dateVal;
      try {
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return dateVal.toString();
        const day = String(d.getDate()).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
      } catch (e) {
        return dateVal.toString();
      }
    };

    const u = userData || {};

    // Profile ID extraction
    const rawId = u.profileId || u.customId || u.id || u._id || Date.now();
    const shortId = rawId.toString().slice(-6).toUpperCase();
    const candidateProfileId = u.profileId || u.customId || `BV-${shortId}`;

    // 1. Personal Details fields
    const fullName = u.name || u.fullName || u.displayName || 'Candidate Member';
    const gender = u.gender || u.sex || 'N/A';
    const dobStr = formatDate(u.dob || u.dateOfBirth || u.birthDate);
    const maritalStatus = u.maritalStatus || u.marital || 'Never Married';
    const bloodGroup = u.bloodGroup || u.blood || u.blood_group || 'N/A';
    const hobbiesStr = Array.isArray(u.hobbies) ? u.hobbies.join(', ') : (u.hobbies || u.interests || 'N/A');
    const heightStr = u.height || u.heightInFt || 'N/A';

    // 2. Family Details fields (mama's surname and mama's contact strictly separated)
    const fatherName = u.fatherName || u.father || u.father_name || 'N/A';
    const motherName = u.motherName || u.mother || u.mother_name || 'N/A';
    const fatherOccupation = u.fatherOccupation || u.parentOccupation || u.father_occupation || 'N/A';
    const motherOccupation = u.motherOccupation || u.mother_occupation || 'Homemaker';

    const brothers = u.brothers !== undefined && u.brothers !== null && u.brothers !== '' ? u.brothers : 0;
    const marriedBrothers = u.marriedBrothers || 0;
    const sisters = u.sisters !== undefined && u.sisters !== null && u.sisters !== '' ? u.sisters : 0;
    const marriedSisters = u.marriedSisters || 0;
    const brothersSistersStr = `${brothers} Brother(s) [${marriedBrothers} Married], ${sisters} Sister(s) [${marriedSisters} Married]`;

    const mamaSurname = u.mamaSurname || u.maternalGothra || u.maternalSurname || 'N/A';
    const mamaContact = u.mamaContact || u.maternalContact || 'N/A';

    const residenceCity = u.nativeDistrict || u.nativeCity || u.parentResidenceCity || u.nativePlace || u.city || 'N/A';
    const permanentAddress = u.permanentAddress || u.address || u.currentAddress || residenceCity;

    // 3. Location, Education & Career fields
    const locationStr = [u.workCity || u.currentCity || u.city, u.state].filter(Boolean).join(', ') || 'N/A';
    const educationStr = u.education || u.highestEducation || u.degree || 'N/A';
    const workSector = u.workSector || u.employmentType || u.sector || u.companyType || 'N/A';
    const occupationStr = u.occupation || u.profession || u.jobTitle || u.designation || 'N/A';
    const collegeStr = u.college || u.university || u.institute || 'N/A';
    const incomeStr = u.income || u.annualIncome || u.salary || 'N/A';

    const bio = u.aboutMe || u.bio || u.profileSummary || u.about || u.description || 'No summary provided.';
    const phoneStr = u.phone || u.mobile || u.contactNumber || u.phoneNumber || '+91 90111 11111';

    // ==========================================
    // 1. HOME SCREEN HEADER LOGO & TAGLINE
    // ==========================================
    let logoH = 36;
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const logoPath = path.join(publicDir, 'logo_header2.png');
      if (fs.existsSync(logoPath)) {
        const logoBytes = fs.readFileSync(logoPath);
        const logoImg = await pdfDoc.embedPng(logoBytes);
        const scaled = logoImg.scaleToFit(140, 36);
        logoH = scaled.height;
        page.drawImage(logoImg, {
          x: (width - scaled.width) / 2,
          y: height - 16 - scaled.height,
          width: scaled.width,
          height: scaled.height,
        });
      } else {
        const logoStr = 'barivivah.in';
        const logoW = boldFont.widthOfTextAtSize(logoStr, 22);
        page.drawText(logoStr, {
          x: (width - logoW) / 2,
          y: height - 16 - 22,
          size: 22,
          font: boldFont,
          color: pinkPrimary,
        });
      }
    } catch (e) {
      console.warn('Header logo render note:', e.message);
    }

    // Tagline Below Logo
    const taglineStr = "India's #1 Most Trusted Bari Matrimony Platform";
    const taglineW = italicFont.widthOfTextAtSize(taglineStr, 8.5);
    const taglineY = height - 16 - logoH - 10;

    page.drawText(taglineStr, {
      x: (width - taglineW) / 2,
      y: taglineY,
      size: 8.5,
      font: italicFont,
      color: pinkPrimary,
    });

    // ==========================================
    // 2. TOP BANNER BAR
    // ==========================================
    const bannerY = taglineY - 30;
    const bannerHeight = 26;
    const bannerWidth = width - (2 * margin);

    drawRoundedRectangle(page, {
      x: margin,
      y: bannerY,
      width: bannerWidth,
      height: bannerHeight,
      radius: 6,
      color: pinkLight,
      borderColor: pinkBorder,
      borderWidth: 1,
    });

    let curX = margin + 110;

    drawBadgeIcon(page, curX + 10, bannerY + 13, 'mail', { pinkPrimary, white });
    curX += 24;

    page.drawText('support@barivivah.in', {
      x: curX,
      y: bannerY + 9,
      size: 8.5,
      font: boldFont,
      color: darkText,
    });
    curX += 120;

    page.drawText('|', { x: curX, y: bannerY + 9, size: 9, font: regularFont, color: rgb(0.75, 0.75, 0.75) });
    curX += 15;

    drawBadgeIcon(page, curX + 10, bannerY + 13, 'phone', { pinkPrimary, white });
    curX += 24;

    page.drawText(phoneStr, {
      x: curX,
      y: bannerY + 9,
      size: 8.5,
      font: boldFont,
      color: darkText,
    });

    // ==========================================
    // 3. TWO COLUMN LAYOUT
    // ==========================================
    const mainY = bannerY - 14;
    const leftColX = margin;
    const leftColWidth = 175;
    const rightColX = leftColX + leftColWidth + 18; // 217
    const rightColWidth = width - margin - rightColX; // 354
    const bottomMargin = 45;

    // ------------------------------------------
    // LEFT COLUMN: PROFILE PHOTO & BIO CARD WITH ID
    // ------------------------------------------
    const photoSize = 165;
    const photoY = mainY - photoSize;

    let profileImage = null;
    const photoUrl = u.profilePhoto || u.photo || (u.photos && u.photos[0]);
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

    // Clean Photo Frame Container
    drawRoundedRectangle(page, {
      x: leftColX,
      y: photoY,
      width: leftColWidth,
      height: photoSize,
      radius: 14,
      color: white,
      borderColor: pinkBorder,
      borderWidth: 1.5,
    });

    if (profileImage) {
      try {
        const scaled = profileImage.scaleToFit(leftColWidth - 10, photoSize - 10);
        const imgX = leftColX + 5 + (leftColWidth - 10 - scaled.width) / 2;
        const imgY = photoY + 5 + (photoSize - 10 - scaled.height) / 2;

        page.drawImage(profileImage, {
          x: imgX,
          y: imgY,
          width: scaled.width,
          height: scaled.height,
        });
      } catch (e) {}
    } else {
      page.drawCircle({ x: leftColX + leftColWidth / 2, y: photoY + 95, size: 28, color: pinkLight, borderColor: pinkBorder, borderWidth: 1 });
      const initialLetter = (fullName || 'V').charAt(0).toUpperCase();
      const initW = boldFont.widthOfTextAtSize(initialLetter, 34);
      page.drawText(initialLetter, {
        x: leftColX + (leftColWidth - initW) / 2,
        y: photoY + 84,
        size: 34,
        font: boldFont,
        color: pinkPrimary,
      });
      page.drawText('Candidate Profile Photo', {
        x: leftColX + 26,
        y: photoY + 30,
        size: 8.5,
        font: boldFont,
        color: labelText,
      });
    }

    // BIO CONTAINER CARD (Extends cleanly to bottomMargin)
    const bioY = bottomMargin;
    const bioHeight = photoY - 12 - bioY;

    drawRoundedRectangle(page, {
      x: leftColX,
      y: bioY,
      width: leftColWidth,
      height: bioHeight,
      radius: 14,
      color: pinkLight,
      borderColor: pinkBorder,
      borderWidth: 1,
    });

    let bioCurY = bioY + bioHeight - 24;

    // Candidate Name
    const nameStr = sanitizeText(fullName);
    page.drawText(nameStr, {
      x: leftColX + 14,
      y: bioCurY,
      size: 15,
      font: boldFont,
      color: darkText,
      maxWidth: leftColWidth - 28,
    });
    bioCurY -= 14;

    // Candidate Profile ID below Name
    const idText = `ID: ${candidateProfileId}`;
    page.drawText(idText, {
      x: leftColX + 14,
      y: bioCurY,
      size: 9.5,
      font: boldFont,
      color: pinkPrimary,
    });
    bioCurY -= 10;

    // Accent line below Candidate ID
    page.drawRectangle({
      x: leftColX + 14,
      y: bioCurY,
      width: 32,
      height: 2.5,
      color: pinkPrimary,
    });
    bioCurY -= 18;

    page.drawText('“', {
      x: leftColX + 10,
      y: bioCurY,
      size: 24,
      font: boldFont,
      color: pinkPrimary,
    });

    const bioTextClean = sanitizeText(bio);
    const bioLines = wrapText(bioTextClean, regularFont, 8.5, leftColWidth - 32);
    let textY = bioCurY - 6;

    bioLines.forEach((line) => {
      page.drawText(line, {
        x: leftColX + 20,
        y: textY,
        size: 8.5,
        font: regularFont,
        color: bodyText,
      });
      textY -= 13;
    });

    page.drawText('”', {
      x: leftColX + leftColWidth - 24,
      y: textY,
      size: 24,
      font: boldFont,
      color: pinkPrimary,
    });

    // ------------------------------------------
    // RIGHT COLUMN: SECTIONS
    // ------------------------------------------
    let rightY = mainY;
    const valueMaxW = rightColWidth - 158;

    const renderSection = (title, iconType, items) => {
      const sanitizedTitle = sanitizeText(title);

      let itemsTotalH = 0;
      const itemRowData = items.map(([label, val]) => {
        const valClean = sanitizeText(val);
        const valLines = wrapText(valClean, boldFont, 9, valueMaxW);
        const rowH = Math.max(17.5, valLines.length * 12.5 + 3.5);
        itemsTotalH += rowH;
        return { label: sanitizeText(label), valLines, rowH };
      });

      const sectionHeight = 28 + itemsTotalH + 6;
      const sectionY = rightY - sectionHeight;

      // Card Container
      drawRoundedRectangle(page, {
        x: rightColX,
        y: sectionY,
        width: rightColWidth,
        height: sectionHeight,
        radius: 12,
        color: white,
        borderColor: pinkBorder,
        borderWidth: 1,
      });

      // Section Header
      const headerCenterY = rightY - 15;
      drawBadgeIcon(page, rightColX + 14, headerCenterY, iconType, { pinkPrimary, white });

      page.drawText(sanitizedTitle, {
        x: rightColX + 28,
        y: headerCenterY - 4,
        size: 12.5,
        font: boldFont,
        color: darkText,
      });

      const titleW = boldFont.widthOfTextAtSize(sanitizedTitle, 12.5);
      page.drawLine({
        start: { x: rightColX + 34 + titleW, y: headerCenterY },
        end: { x: rightColX + rightColWidth - 12, y: headerCenterY },
        thickness: 1,
        color: pinkPrimary,
      });

      // Dynamic Item Rows
      let curItemY = headerCenterY - 18;
      itemRowData.forEach(({ label, valLines, rowH }) => {
        page.drawText(label, {
          x: rightColX + 12,
          y: curItemY,
          size: 9,
          font: regularFont,
          color: labelText,
          maxWidth: 120,
        });

        page.drawText(':', {
          x: rightColX + 136,
          y: curItemY,
          size: 9,
          font: boldFont,
          color: bodyText,
        });

        let lineY = curItemY;
        valLines.forEach((l) => {
          page.drawText(l, {
            x: rightColX + 148,
            y: lineY,
            size: 9,
            font: boldFont,
            color: darkText,
          });
          lineY -= 12.5;
        });

        curItemY -= rowH;
      });

      rightY = sectionY - 9;
    };

    // 1) Personal Details
    renderSection('Personal Details', 'person', [
      ['Full Name', fullName],
      ['Gender', gender],
      ['Date Of Birth', dobStr],
      ['Marital Status', maritalStatus],
      ['Blood Group', bloodGroup],
      ['Hobbies & Interest', hobbiesStr],
      ['Height', heightStr],
    ]);

    // 2) Family Details (Strictly separated Mama's Surname & Mama's Contact)
    renderSection('Family Details', 'family', [
      ['Father Name', fatherName],
      ['Mother Name', motherName],
      ['Father Occupation', fatherOccupation],
      ['Mother Occupation', motherOccupation],
      ['Brothers & Sisters', brothersSistersStr],
      ['Mama\'s Surname', mamaSurname],
      ['Mama\'s Contact', mamaContact],
      ['Residence / Family City', residenceCity],
      ['Permanent Address', permanentAddress],
    ]);

    // 3) Location, Education & Career
    renderSection('Location, Education & Career', 'education', [
      ['Location', locationStr],
      ['Education', educationStr],
      ['Work Sectors', workSector],
      ['Occupation', occupationStr],
      ['College Attended', collegeStr],
      ['Income', incomeStr],
    ]);

    // ==========================================
    // 4. FOOTER (DRAWN ON ALL PAGES)
    // ==========================================
    const totalPages = pdfDoc.getPageCount();
    const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    for (let pIdx = 0; pIdx < totalPages; pIdx++) {
      const p = pdfDoc.getPage(pIdx);

      // Footer divider line
      p.drawLine({
        start: { x: margin, y: 30 },
        end: { x: width - margin, y: 30 },
        thickness: 0.6,
        color: pinkBorder,
      });

      // Left Footer
      p.drawText('BariVivah Matrimony — Confidential Candidate Biodata', {
        x: margin,
        y: 16,
        size: 8.5,
        font: boldFont,
        color: pinkPrimary,
      });

      // Right Footer
      const rightFooterText = `Generated: ${todayStr}  |  Page ${pIdx + 1} of ${totalPages}`;
      const rightW = regularFont.widthOfTextAtSize(rightFooterText, 8.5);

      p.drawText(rightFooterText, {
        x: width - margin - rightW,
        y: 16,
        size: 8.5,
        font: regularFont,
        color: bodyText,
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