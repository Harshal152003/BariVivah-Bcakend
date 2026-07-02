import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { createToken, setTokenCookie } from "@/lib/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

const getCorsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
});

function hashPassword(password) {
  const salt = "barivivah_salt_12345";
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export async function POST(request) {
  const origin = request.headers.get("origin");
  const headers = getCorsHeaders(origin);

  try {
    await dbConnect();
    const body = await request.json();
    const { phone, password } = body;

    // Validation
    if (!phone || !password) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Phone and password are required" }),
        { status: 400, headers }
      );
    }

    const cleanPhone = phone.replace(/\s/g, "");
    const fullPhone = `+91${cleanPhone}`;

    // Find User
    const user = await User.findOne({ phone: fullPhone });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid mobile number or password" }),
        { status: 401, headers }
      );
    }

    // Check if password exists (legacy users)
    if (!user.password) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "No password set for this account. Please register again." }),
        { status: 400, headers }
      );
    }

    // Compare Password
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid mobile number or password" }),
        { status: 401, headers }
      );
    }

    // Update login stats
    user.lastLoginAt = new Date();
    await user.save();

    // Create token & response
    const token = createToken(user._id);
    const userData = {
      id: user._id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      phoneIsVerified: user.phoneIsVerified,
      subscription: user.subscription || null,
      profilePhoto: user.profilePhoto,
      gender: user.gender,
      currentCity: user.currentCity,
      profileCompletion: user.profileCompletion,
    };

    const response = new NextResponse(
      JSON.stringify({
        success: true,
        message: "Login successful",
        user: userData,
        token,
      }),
      { headers }
    );

    setTokenCookie(response, token);
    return response;

  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500, headers }
    );
  }
}

export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    headers: getCorsHeaders(origin),
  });
}
