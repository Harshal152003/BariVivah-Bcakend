// import otpStore from "../../../lib/otpStore";
// import { NextResponse } from "next/server";
// import twilio from "twilio";

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// // Define CORS headers
// const corsHeaders = {
//   'Access-Control-Allow-Origin': 'http://localhost:8081',
//   'Access-Control-Allow-Methods': 'POST, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type',
//   'Access-Control-Allow-Credentials' : true,
// };

// export async function POST(req) {
//   try {
//     const { phoneNumber } = await req.json();
//     if (!phoneNumber || phoneNumber.length !== 10) {
//       return new NextResponse(
//         JSON.stringify({ success: false, message: "Invalid phone number" }), 
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     const fullPhoneNumber = `+91${phoneNumber}`;
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await client.messages.create({
//       body: `Your OTP is ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: fullPhoneNumber,
//     });

//     otpStore.set(fullPhoneNumber, otp);
//     setTimeout(() => otpStore.delete(fullPhoneNumber), 5 * 60 * 1000);

//     return new NextResponse(
//       JSON.stringify({ success: true, message: "OTP sent successfully" }),
//       { headers: corsHeaders }
//     );
//   } catch (error) {
//     return new NextResponse(
//       JSON.stringify({ success: false, message: "Error sending OTP", error: error.message }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     headers: corsHeaders
//   });
// }

import otpStore from "../../../lib/otpStore";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { emailService } from "@/services/email/email.service";

export async function POST(req) {
  try {
    const { phoneNumber, email, mode, isRegistration } = await req.json();
    if (!phoneNumber || phoneNumber.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    const fullPhoneNumber = `+91${phoneNumber}`;

    // Connect DB & Check if email/phone is already registered for registration requests
    await dbConnect();
    if (mode === 'register' || isRegistration) {
      const existingPhoneUser = await User.findOne({ phone: fullPhoneNumber });
      if (existingPhoneUser && existingPhoneUser.name && existingPhoneUser.password) {
        return NextResponse.json(
          { success: false, message: "This mobile number is already registered. Please login instead." },
          { status: 400 }
        );
      }

      if (email && email.trim() !== "") {
        const cleanEmail = email.toLowerCase().trim();
        const existingEmailUser = await User.findOne({ email: cleanEmail });
        if (existingEmailUser && existingEmailUser.name && existingEmailUser.password) {
          return NextResponse.json(
            { success: false, message: "This email address is already registered. Please use another email or login." },
            { status: 400 }
          );
        }
      }
    }

    console.log("Generating OTP...");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP via Fast2SMS (DLT template)
    if (process.env.FAST2SMS_API_KEY && process.env.FAST2SMS_API_KEY !== 'undefined') {
      console.log(`[OTP] Attempting to send actual SMS to +91${phoneNumber} via Fast2SMS`);
      const fast2smsResponse = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          Authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "dlt",
          sender_id: "SHVBDN", // Your approved sender id
          message: "197321",   // Your template_id
          variables_values: otp, // OTP fills {#var#}
          numbers: phoneNumber,  // Send without +91
        }),
      });

      const responseData = await fast2smsResponse.json();

      if (!responseData.return) {
        throw new Error(responseData.message || "Failed to send OTP via Fast2SMS");
      }
    } else {
      console.log("\n==================================================");
      console.log(`[LOCAL DEV OTP] Mobile: +91${phoneNumber}`);
      console.log(`[LOCAL DEV OTP] Code:   ${otp}`);
      console.log("==================================================\n");
    }

    // Store OTP in memory
    otpStore.set(fullPhoneNumber, otp);
    console.log("OTP stored successfully.");
    const deleteTimeout = setTimeout(() => otpStore.delete(fullPhoneNumber), 5 * 60 * 1000);

    // Try to resolve recipient email
    let recipientEmail = email;
    if (!recipientEmail) {
      try {
        await dbConnect();
        const user = await User.findOne({ phone: { $in: [fullPhoneNumber, phoneNumber] } });
        if (user && user.email) {
          recipientEmail = user.email;
        }
      } catch (dbError) {
        console.error("[send-otp] DB error looking up user email:", dbError);
      }
    }

    // If an email is available, deliver the OTP via Resend
    if (recipientEmail) {
      console.log("Sending OTP email...");
      try {
        await emailService.sendOTPEmail(recipientEmail, otp, 5);
        console.log("Email delivered successfully.");
      } catch (emailError) {
        console.error("Resend API Error:", emailError);
        // Rollback/Clean up OTP store mapping to avoid inconsistent state on delivery failure
        clearTimeout(deleteTimeout);
        otpStore.delete(fullPhoneNumber);
        return NextResponse.json(
          { success: false, message: "Failed to deliver verification email", error: emailError.message },
          { status: 500 }
        );
      }
    } else {
      console.log(`[send-otp] No email address associated/provided for +91${phoneNumber}. Skipping email OTP delivery.`);
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully", otp });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error sending OTP", error: error.message },
      { status: 500 }
    );
  }
}

