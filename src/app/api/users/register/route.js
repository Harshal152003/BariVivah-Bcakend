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
    const { name, phone, email, password, gender } = body;

    // Validation
    if (!name || !phone || !password || !gender) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400, headers }
      );
    }

    const cleanPhone = phone.replace(/\s/g, "");
    if (!/^\d{10}$/.test(cleanPhone)) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid 10-digit mobile number" }),
        { status: 400, headers }
      );
    }

    const fullPhone = `+91${cleanPhone}`;

    // Check duplicate phone
    const existingPhoneUser = await User.findOne({ phone: fullPhone });
    if (existingPhoneUser) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Mobile number already registered" }),
        { status: 400, headers }
      );
    }

    // Check duplicate email (if provided)
    if (email && email.trim() !== "") {
      const existingEmailUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingEmailUser) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Email address already registered" }),
          { status: 400, headers }
        );
      }
    }

    // Hash Password
    const hashedPassword = hashPassword(password);

    // Create User
    const user = new User({
      name,
      phone: fullPhone,
      email: email ? email.toLowerCase().trim() : null,
      password: hashedPassword,
      gender,
      isVerified: false,
      phoneIsVerified: true,
      lastLoginAt: new Date(),
    });

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
        message: "Registration successful",
        user: userData,
        token,
      }),
      { headers }
    );

    setTokenCookie(response, token);
    return response;

  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error", details: error.message }),
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
