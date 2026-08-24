import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

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
    const margin = 36;
    const contentWidth = width - (2 * margin); // 523 pt

    // Color Palette
    const primaryRed = rgb(0.88, 0.12, 0.32);     // #E11D48
    const primaryDark = rgb(0.06, 0.09, 0.16);    // #0F172A
    const darkText = rgb(0.12, 0.16, 0.23);       // #1E293B
    const bodyText = rgb(0.28, 0.34, 0.43);       // #475569
    const lightText = rgb(0.58, 0.64, 0.72);      // #94A3B8
    const borderGray = rgb(0.88, 0.91, 0.94);     // #E2E8F0
    const lightGray = rgb(0.97, 0.98, 0.99);      // #F8FAFC

    // Helper: Sanitize & clean text for PDF Standard fonts
    const sanitizeText = (text) => {
      if (text === null || text === undefined) return '';
      return text.toString()
        .replace(/₹/g, 'Rs.')
        .replace(/[^\x00-\x7F]/g, '')
        .trim();
    };

    // Helper: Safe Text Drawer
    const drawTextOnPage = (targetPage, text, x, y, options = {}) => {
      const fontSize = options.size || 10;
      const font = options.bold ? boldFont : (options.italic ? italicFont : regularFont);
      const color = options.color || darkText;
      const safe = sanitizeText(text);
      if (!safe) return;

      try {
        targetPage.drawText(safe, {
          x,
          y,
          size: fontSize,
          font,
          color,
          maxWidth: options.maxWidth || contentWidth,
          lineHeight: options.lineHeight || (fontSize + 3),
        });
      } catch (err) {
        console.warn('PDF text render error:', err.message);
      }
    };

    // Helper: Calculate text width
    const getTextWidth = (text, size = 10, isBold = false) => {
      const font = isBold ? boldFont : regularFont;
      const safe = sanitizeText(text);
      try {
        return font.widthOfTextAtSize(safe, size);
      } catch (e) {
        return safe.length * (size * 0.5);
      }
    };

    // Load Logo Image
    let logoImage = null;
    try {
      const fs = require('fs');
      const path = require('path');
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        const logoBytes = fs.readFileSync(logoPath);
        logoImage = await pdfDoc.embedPng(logoBytes);
      }
    } catch (e) {
      console.warn('Company logo not found, skipping:', e.message);
    }

    // Load Profile Image
    let profileImage = null;
    const photoUrl = userData.profilePhoto || userData.photo || (userData.photos && userData.photos[0]);
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
            } catch (pngErr) {
              console.warn('Failed to embed profile image as JPG or PNG:', pngErr.message);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch candidate profile image:', err.message);
      }
    }

    // Page Break Tracker
    let currentY = height - margin;

    const checkPageBreak = (neededHeight) => {
      if (currentY - neededHeight < margin + 40) {
        page = pdfDoc.addPage([595, 842]);
        currentY = height - margin - 20;

        // Draw top subtle running header on page 2+
        page.drawLine({
          start: { x: margin, y: height - 25 },
          end: { x: width - margin, y: height - 25 },
          thickness: 0.5,
          color: borderGray,
        });

        const nameStr = sanitizeText(userData.name || userData.fullName || 'Candidate Biodata');
        drawTextOnPage(page, `BariVivah Biodata — ${nameStr}`, margin, height - 20, {
          size: 8.5,
          italic: true,
          color: lightText,
        });
      }
    };

    // Date & Age Formatters
    const formatDate = (dateVal) => {
      if (!dateVal) return 'N/A';
      if (typeof dateVal === 'string' && dateVal.includes('/')) return dateVal;
      try {
        const d = new Date(dateVal);
        return isNaN(d.getTime()) ? dateVal : d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      } catch (e) {
        return dateVal.toString();
      }
    };

    const calculateAge = (dobVal) => {
      if (!dobVal) return null;
      let birthDate;
      if (typeof dobVal === 'string' && dobVal.includes('/')) {
        const parts = dobVal.split('/');
        if (parts.length === 3) {
          birthDate = new Date(parts[2], parts[1] - 1, parts[0]);
        } else {
          birthDate = new Date(dobVal);
        }
      } else {
        birthDate = new Date(dobVal);
      }
      if (isNaN(birthDate.getTime())) return null;
      const ageDiff = Date.now() - birthDate.getTime();
      return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
    };

    // Extract all candidate profile fields supporting all naming conventions
    const u = userData || {};

    const name = u.name || u.fullName || u.displayName || 'Candidate Member';
    const age = u.age || calculateAge(u.dob || u.dateOfBirth || u.birthDate);
    const dobStr = formatDate(u.dob || u.dateOfBirth || u.birthDate);
    const heightStr = u.height || u.heightInFt || 'N/A';
    const weightStr = u.weight ? `${u.weight} kg` : 'N/A';
    const gender = u.gender || u.sex || 'N/A';
    const maritalStatus = u.maritalStatus || u.marital || 'Never Married';
    const motherTongue = u.motherTongue || u.language || 'N/A';
    const diet = u.diet || u.eatingHabits || u.dietaryHabits || 'N/A';
    const bloodGroup = u.bloodGroup || u.blood || 'N/A';
    const wearsLens = u.wearsLens !== undefined ? (u.wearsLens === 'Yes' || u.wearsLens === true ? 'Yes' : 'No') : 'N/A';
    const complexion = u.complexion || u.skinTone || 'N/A';

    const religion = u.religion || 'Hindu';
    const caste = u.caste || 'Bari';
    const subCaste = u.subCaste || u.subcaste || 'N/A';
    const gothra = u.gothra || u.gotra || 'N/A';
    const rashi = u.rashi || u.zodiac || 'N/A';
    const nakshatra = u.nakshatra || u.star || 'N/A';
    const mangal = u.mangal || u.mangalDosha || u.manglik || 'No / Anshik';
    const birthTime = u.birthTime || u.timeOfBirth || 'N/A';
    const birthPlace = u.birthPlace || u.placeOfBirth || u.nativeCity || 'N/A';

    const education = u.education || u.educationLevel || u.highestEducation || u.degree || 'N/A';
    const fieldOfStudy = u.fieldOfStudy || u.field || u.specialization || u.branch || 'N/A';
    const college = u.college || u.university || u.institute || 'N/A';
    const occupation = u.occupation || u.profession || u.jobTitle || u.designation || 'N/A';
    const company = u.company || u.companyName || u.employer || u.organization || 'N/A';
    const workSector = u.workSector || u.employmentType || u.sector || 'N/A';
    const income = u.income || u.annualIncome || u.salary || 'N/A';
    const workCity = u.workCity || u.workLocation || u.currentCity || u.city || 'N/A';

    const fatherName = u.fatherName || u.father || u.father_name || 'N/A';
    const fatherOccupation = u.parentOccupation || u.fatherOccupation || u.father_occupation || 'N/A';
    const motherName = u.mother || u.motherName || u.mother_name || 'N/A';
    const motherOccupation = u.motherOccupation || u.mother_occupation || 'Homemaker';

    let brothersStr = '0';
    if (u.brothers !== undefined && u.brothers !== null && u.brothers !== '') {
      brothersStr = `${u.brothers} (${u.marriedBrothers || 0} Married)`;
    }

    let sistersStr = '0';
    if (u.sisters !== undefined && u.sisters !== null && u.sisters !== '') {
      sistersStr = `${u.sisters} (${u.marriedSisters || 0} Married)`;
    }

    const nativeCity = u.nativeDistrict || u.nativeCity || u.parentResidenceCity || u.nativePlace || 'N/A';
    const mamaSurname = u.mamaSurname || u.maternalGothra || u.maternalSurname || 'N/A';
    const familyStatus = u.familyBackground || u.familyStatus || u.familyType || 'Traditional';

    const bio = u.aboutMe || u.bio || u.profileSummary || u.about || 'N/A';
    const hobbies = Array.isArray(u.hobbies) ? u.hobbies.join(', ') : (u.hobbies || 'N/A');

    const phone = u.phone || u.mobile || u.contactNumber || u.phoneNumber || 'N/A';
    const email = u.email || u.emailAddress || 'N/A';
    const alternatePhone = u.alternatePhone || u.alternateMobile || 'N/A';
    const currentAddress = u.address || u.permanentAddress || u.currentCity || u.city || 'N/A';

    const partnerAge = u.partnerAgeRange || u.expectations?.age || u.partnerAge || 'N/A';
    const partnerMarital = u.partnerMaritalStatus || u.expectations?.maritalStatus || 'Never Married';
    const partnerCaste = u.partnerCaste || u.expectations?.caste || 'Bari / Any';
    const partnerEducation = u.partnerEducation || u.expectations?.education || 'N/A';
    const partnerOccupation = u.partnerOccupation || u.expectations?.occupation || 'N/A';
    const partnerCity = u.partnerCity || u.expectations?.city || 'N/A';

    // ==========================================
    // 1. TOP BRANDING HEADER
    // ==========================================
    if (logoImage) {
      page.drawImage(logoImage, {
        x: margin,
        y: currentY - 30,
        width: 85,
        height: 28,
      });
    }

    const headerTextX = logoImage ? margin + 98 : margin;
    drawTextOnPage(page, 'BariVivah Matrimony', headerTextX, currentY - 10, {
      size: 16,
      bold: true,
      color: primaryRed,
    });

    drawTextOnPage(page, 'Trusted Bari Community Matrimonial Portal', headerTextX, currentY - 22, {
      size: 8,
      italic: true,
      color: lightText,
    });

    drawTextOnPage(page, 'Helpline: +91-9503424635  |  Email: support@barivivah.in', headerTextX, currentY - 33, {
      size: 8,
      color: bodyText,
    });

    currentY -= 48;

    // Header Divider Line
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: width - margin, y: currentY },
      thickness: 1.5,
      color: primaryRed,
    });

    currentY -= 15;

    // ==========================================
    // 2. CANDIDATE HERO HEADER & PHOTO BOX
    // ==========================================
    const photoBoxWidth = 110;
    const photoBoxHeight = 135;
    const photoBoxX = width - margin - photoBoxWidth; // 449 pt
    const photoBoxY = currentY - photoBoxHeight;

    // Left text area width (leaves 18pt safe padding before photo box)
    const textAreaWidth = photoBoxX - margin - 18; // 395 pt

    // Render Photo Box Frame (Right side)
    page.drawRectangle({
      x: photoBoxX,
      y: photoBoxY,
      width: photoBoxWidth,
      height: photoBoxHeight,
      borderColor: borderGray,
      borderWidth: 1.5,
      color: lightGray,
    });

    if (profileImage) {
      try {
        const scaled = profileImage.scaleToFit(photoBoxWidth - 6, photoBoxHeight - 6);
        const imgX = photoBoxX + 3 + (photoBoxWidth - 6 - scaled.width) / 2;
        const imgY = photoBoxY + 3 + (photoBoxHeight - 6 - scaled.height) / 2;

        page.drawImage(profileImage, {
          x: imgX,
          y: imgY,
          width: scaled.width,
          height: scaled.height,
        });
      } catch (imgErr) {
        console.warn('Error drawing profile image onto PDF page:', imgErr.message);
      }
    } else {
      // Placeholder text if photo not available
      drawTextOnPage(page, 'Photo Not', photoBoxX + 28, photoBoxY + 75, {
        size: 9,
        color: lightText,
      });
      drawTextOnPage(page, 'Available', photoBoxX + 30, photoBoxY + 60, {
        size: 9,
        color: lightText,
      });
    }

    // Render Candidate Quick Info (Left side - strictly inside textAreaWidth)
    let headerTextY = currentY - 5;

    // Name
    drawTextOnPage(page, name, margin, headerTextY, {
      size: 18,
      bold: true,
      color: primaryDark,
      maxWidth: textAreaWidth,
    });
    headerTextY -= 22;

    // Profile ID
    const rawId = u.id || u._id || Date.now();
    const shortId = rawId.toString().slice(-6).toUpperCase();
    const profileIdStr = `Profile ID: BV-${shortId}`;
    drawTextOnPage(page, profileIdStr, margin, headerTextY, {
      size: 10,
      bold: true,
      color: primaryRed,
    });
    headerTextY -= 16;

    // Key stats row
    const line1 = `Age: ${age ? `${age} Yrs` : 'N/A'}  •  DOB: ${dobStr}  •  Height: ${heightStr}`;
    drawTextOnPage(page, line1, margin, headerTextY, {
      size: 9.5,
      color: bodyText,
      maxWidth: textAreaWidth,
    });
    headerTextY -= 15;

    const subCasteStr = subCaste && subCaste !== 'N/A' ? ` (${subCaste})` : '';
    const line2 = `Community: ${religion} - ${caste}${subCasteStr}`;
    drawTextOnPage(page, line2, margin, headerTextY, {
      size: 9.5,
      color: bodyText,
      maxWidth: textAreaWidth,
    });
    headerTextY -= 15;

    const line3 = `Current City: ${workCity}  •  Status: ${maritalStatus}`;
    drawTextOnPage(page, line3, margin, headerTextY, {
      size: 9.5,
      color: bodyText,
      maxWidth: textAreaWidth,
    });

    // Advance currentY past the bottom of the photo box & header text
    currentY = Math.min(headerTextY - 15, photoBoxY - 15);

    // ==========================================
    // SECTION BUILDERS
    // ==========================================
    const renderSectionHeader = (title) => {
      checkPageBreak(32);

      // Light background bar
      page.drawRectangle({
        x: margin,
        y: currentY - 18,
        width: contentWidth,
        height: 22,
        color: lightGray,
        borderColor: borderGray,
        borderWidth: 0.5,
      });

      // Left accent bar
      page.drawRectangle({
        x: margin,
        y: currentY - 18,
        width: 4,
        height: 22,
        color: primaryRed,
      });

      drawTextOnPage(page, title.toUpperCase(), margin + 12, currentY - 12, {
        size: 10.5,
        bold: true,
        color: primaryDark,
      });

      currentY -= 28;
    };

    // 2-Column Data Grid Renderer
    const renderGridSection = (title, items) => {
      const validItems = items.filter(([_, val]) => val !== undefined && val !== null && val !== '');
      if (validItems.length === 0) return;

      renderSectionHeader(title);

      const col1X = margin + 8;
      const col2X = margin + (contentWidth / 2) + 8;
      const colWidth = (contentWidth / 2) - 16;

      for (let i = 0; i < validItems.length; i += 2) {
        checkPageBreak(18);

        // Optional zebra striping
        if ((i / 2) % 2 === 1) {
          page.drawRectangle({
            x: margin,
            y: currentY - 13,
            width: contentWidth,
            height: 16,
            color: lightGray,
            opacity: 0.4,
          });
        }

        // Left Item
        const [label1, value1] = validItems[i];
        const valStr1 = sanitizeText(value1.toString());
        drawTextOnPage(page, `${label1}:`, col1X, currentY - 10, {
          size: 9,
          bold: true,
          color: bodyText,
        });
        drawTextOnPage(page, valStr1, col1X + 95, currentY - 10, {
          size: 9,
          color: darkText,
          maxWidth: colWidth - 95,
        });

        // Right Item (if exists)
        if (i + 1 < validItems.length) {
          const [label2, value2] = validItems[i + 1];
          const valStr2 = sanitizeText(value2.toString());
          drawTextOnPage(page, `${label2}:`, col2X, currentY - 10, {
            size: 9,
            bold: true,
            color: bodyText,
          });
          drawTextOnPage(page, valStr2, col2X + 95, currentY - 10, {
            size: 9,
            color: darkText,
            maxWidth: colWidth - 95,
          });
        }

        currentY -= 17;
      }

      currentY -= 8;
    };

    // Full-Width Text Section (e.g. Bio / Hobbies / Address)
    const renderFullWidthSection = (title, items) => {
      const validItems = items.filter(([_, val]) => val !== undefined && val !== null && val !== '');
      if (validItems.length === 0) return;

      renderSectionHeader(title);

      validItems.forEach(([label, value]) => {
        const valStr = sanitizeText(value.toString());
        const labelWidth = getTextWidth(`${label}: `, 9, true);

        // Estimate lines needed
        const charsPerLine = 85;
        const lineCount = Math.ceil(valStr.length / charsPerLine) || 1;
        const neededH = Math.max(18, lineCount * 14);

        checkPageBreak(neededH);

        drawTextOnPage(page, `${label}:`, margin + 8, currentY - 10, {
          size: 9,
          bold: true,
          color: bodyText,
        });

        drawTextOnPage(page, valStr, margin + 8 + labelWidth + 4, currentY - 10, {
          size: 9,
          color: darkText,
          maxWidth: contentWidth - 16 - labelWidth,
          lineHeight: 13,
        });

        currentY -= (neededH + 4);
      });

      currentY -= 6;
    };

    // ==========================================
    // 3. RENDER ALL PROFILE SECTIONS
    // ==========================================

    // 1. Personal & Physical Details
    renderGridSection('1. Personal & Physical Information', [
      ['Full Name', name],
      ['Gender', gender],
      ['Age', age ? `${age} Years` : 'N/A'],
      ['Date of Birth', dobStr],
      ['Height', heightStr],
      ['Weight', weightStr],
      ['Marital Status', maritalStatus],
      ['Mother Tongue', motherTongue],
      ['Diet', diet],
      ['Blood Group', bloodGroup],
      ['Spectacles/Lens', wearsLens],
      ['Complexion', complexion],
    ]);

    // 2. Religious & Astrology (Kundali) Details
    renderGridSection('2. Religious & Horoscope (Kundali) Details', [
      ['Religion', religion],
      ['Caste', caste],
      ['Sub-Caste', subCaste],
      ['Gothra', gothra],
      ['Rashi (Zodiac)', rashi],
      ['Nakshatra (Star)', nakshatra],
      ['Mangal / Dosha', mangal],
      ['Time of Birth', birthTime],
      ['Place of Birth', birthPlace],
    ]);

    // 3. Education & Career Information
    renderGridSection('3. Education & Career Information', [
      ['Highest Education', education],
      ['Field / Degree', fieldOfStudy],
      ['College/Institute', college],
      ['Occupation / Job', occupation],
      ['Company / Employer', company],
      ['Work Sector', workSector],
      ['Annual Income', income],
      ['Work Location', workCity],
    ]);

    // 4. Family Background & Relatives
    renderGridSection('4. Family Background & Relatives', [
      ['Father\'s Name', fatherName],
      ['Father\'s Occupation', fatherOccupation],
      ['Mother\'s Name', motherName],
      ['Mother\'s Occupation', motherOccupation],
      ['Brothers Count', brothersStr],
      ['Sisters Count', sistersStr],
      ['Native District/City', nativeCity],
      ['Mama (Maternal) Surname', mamaSurname],
      ['Family Status/Values', familyStatus],
    ]);

    // 5. About Candidate & Hobbies (Full Width)
    renderFullWidthSection('5. About Candidate & Hobbies', [
      ['Profile Bio', bio],
      ['Hobbies & Interests', hobbies],
    ]);

    // 6. Contact Details (If provided / Unlocked)
    renderFullWidthSection('6. Direct Contact Information', [
      ['Phone / Mobile', phone],
      ['Email Address', email],
      ['Alternate Phone', alternatePhone],
      ['Current Address', currentAddress],
    ]);

    // 7. Partner Preferences & Expectations
    renderGridSection('7. Partner Preferences & Expectations', [
      ['Preferred Age', partnerAge],
      ['Preferred Marital Status', partnerMarital],
      ['Preferred Religion/Caste', partnerCaste],
      ['Preferred Education', partnerEducation],
      ['Preferred Profession', partnerOccupation],
      ['Preferred Location', partnerCity],
    ]);

    // ==========================================
    // 4. PAGE FOOTER (DRAWN ON ALL PAGES)
    // ==========================================
    const totalPages = pdfDoc.getPageCount();
    for (let pIdx = 0; pIdx < totalPages; pIdx++) {
      const p = pdfDoc.getPage(pIdx);

      // Footer divider line
      p.drawLine({
        start: { x: margin, y: 35 },
        end: { x: width - margin, y: 35 },
        thickness: 0.5,
        color: borderGray,
      });

      // Footer content
      drawTextOnPage(p, 'Barivivah Matrimony — Confidential Candidate Biodata', margin, 22, {
        size: 8,
        bold: true,
        color: primaryRed,
      });

      const todayStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      drawTextOnPage(p, `Generated: ${todayStr}  |  Page ${pIdx + 1} of ${totalPages}`, width - margin - 150, 22, {
        size: 8,
        color: lightText,
      });
    }

    // Output Base64 PDF
    const pdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');
    const sanitizedName = (name || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `BariVivah_Biodata_${sanitizedName}.pdf`;

    return NextResponse.json({
      success: true,
      pdf: base64Pdf,
      fileName,
      message: 'Candidate Profile PDF generated successfully',
      profileId: `BV-${shortId}`
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate profile PDF',
        error: error.message
      },
      { status: 500 }
    );
  }
}