import otpStore from "../../../lib/otpStore";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { createToken, setTokenCookie, createRegistrationToken } from "@/lib/auth";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081', // Or your specific origin
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': true,
};

export async function POST(req) {
  try {
    const { phoneNumber, otp } = await req.json();

    // Input validation
    if (!phoneNumber || phoneNumber.length !== 10 || !otp || otp.length !== 6) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Invalid phone number or OTP" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const fullPhoneNumber = `+91${phoneNumber}`;
    const storedOTP = otpStore.get(fullPhoneNumber) || otpStore.get(phoneNumber);

    // Support dedicated test accounts configured for App Store / Play Store review and testing
    const configuredTestPhones = (process.env.STORE_REVIEW_TEST_PHONE || '+919999999999,+919876543210')
      .split(',')
      .map(p => p.trim());
    const testOtp = process.env.STORE_REVIEW_TEST_OTP || '123456';
    const isTestAccount = (configuredTestPhones.includes(fullPhoneNumber) || configuredTestPhones.includes(phoneNumber)) && otp.toString() === testOtp;
    const isMatchingStoredOtp = storedOTP && storedOTP === otp.toString();

    // OTP verification
    if (!isTestAccount && !isMatchingStoredOtp) {
      if (!storedOTP) {
        return new NextResponse(
          JSON.stringify({ success: false, error: "OTP expired or not sent" }),
          { status: 400, headers: corsHeaders }
        );
      }
      return new NextResponse(
        JSON.stringify({ success: false, error: "Invalid OTP" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Immediately consume OTP to prevent replay attacks
    if (!isTestAccount) {
      otpStore.delete(fullPhoneNumber);
      otpStore.delete(phoneNumber);
    }

    await dbConnect();

    const rawPhone = String(phoneNumber).trim();
    const fullPhone = String(fullPhoneNumber).trim();

    // Check for both formats: with and without +91
    const matchingUsers = await User.find({
      phone: { $in: [fullPhone, rawPhone] }
    }).sort({ createdAt: 1 });

    // Filter out any legacy ghost accounts (no name and no password)
    const validUsers = matchingUsers.filter(u => u.name || u.password);

    if (validUsers.length === 0) {
      // Clean up any legacy blank ghost records for this phone number if they exist
      if (matchingUsers.length > 0) {
        await User.deleteMany({
          phone: { $in: [fullPhone, rawPhone] },
          name: { $in: [null, undefined, ""] },
          password: { $in: [null, undefined, ""] }
        });
      }

      // Do NOT create an empty document in MongoDB.
      // Issue a signed registration token valid for 15 minutes.
      const registrationToken = createRegistrationToken(fullPhone);

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Phone number verified successfully",
          isNewUser: true,
          registrationToken,
          phoneVerificationToken: registrationToken,
          user: {
            phone: fullPhone,
            phoneIsVerified: true
          }
        }),
        { headers: corsHeaders }
      );
    }

    // Existing completed user found
    let user;
    if (validUsers.length > 1) {
      const mainUser = validUsers[0];
      const duplicateUser = validUsers[1];
      console.log(`[Merge] Merging duplicate user ${duplicateUser._id} into ${mainUser._id}`);

      if (mainUser.phone !== fullPhoneNumber) {
        mainUser.phone = fullPhoneNumber;
      }
      await User.findByIdAndDelete(duplicateUser._id);
      user = mainUser;
    } else {
      user = validUsers[0];
      if (user.phone !== fullPhoneNumber) {
        user.phone = fullPhoneNumber;
      }
    }

    user.lastLoginAt = new Date();
    user.phoneIsVerified = true;
    await user.save();

    // Create session token
    const token = createToken(user._id);
    const response = new NextResponse(
      JSON.stringify({
        success: true,
        message: "OTP verified successfully",
        userId: user._id,
        isNewUser: false,
        user: {
          phone: user.phone,
          isVerified: user.isVerified,
          phoneIsVerified: user.phoneIsVerified
        }
      }),
      { headers: corsHeaders }
    );

    // Set HTTP-only cookie
    setTokenCookie(response, token);
    return response;

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new NextResponse(
      JSON.stringify({ success: false, error: "Error verifying OTP" }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Add OPTIONS handler for preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: corsHeaders
  });
}