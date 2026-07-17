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

    // Hash Password
    const hashedPassword = hashPassword(password);

    // Check duplicate phone
    const existingPhoneUser = await User.findOne({ phone: fullPhone });
    if (existingPhoneUser) {
      // If user exists but is a blank template created by verify-otp (no name & password), we populate it
      if (!existingPhoneUser.name && !existingPhoneUser.password) {
        existingPhoneUser.name = name;
        existingPhoneUser.email = email ? email.toLowerCase().trim() : null;
        existingPhoneUser.password = hashedPassword;
        existingPhoneUser.gender = gender;
        existingPhoneUser.createdFor = body.createdFor || 'Self';
        existingPhoneUser.state = body.state || null;
        existingPhoneUser.currentCity = body.currentCity || null;
        existingPhoneUser.caste = body.caste || 'Bari';
        existingPhoneUser.religion = 'Hindu';
        existingPhoneUser.expectedCaste = 'Bari';
        existingPhoneUser.maritalStatus = body.maritalStatus || null;
        existingPhoneUser.height = body.height || null;
        existingPhoneUser.diet = body.diet || null;
        existingPhoneUser.education = body.education || null;
        existingPhoneUser.income = body.income || null;
        existingPhoneUser.workSector = body.workSector || null;
        existingPhoneUser.occupation = body.occupation || null;
        existingPhoneUser.profilePhoto = body.profilePhoto || null;
        existingPhoneUser.lastLoginAt = new Date();

        await existingPhoneUser.save();

        const token = createToken(existingPhoneUser._id);
        const userData = {
          id: existingPhoneUser._id,
          phone: existingPhoneUser.phone,
          name: existingPhoneUser.name,
          email: existingPhoneUser.email,
          isVerified: existingPhoneUser.isVerified,
          phoneIsVerified: existingPhoneUser.phoneIsVerified,
          subscription: existingPhoneUser.subscription || null,
          profilePhoto: existingPhoneUser.profilePhoto,
          gender: existingPhoneUser.gender,
          currentCity: existingPhoneUser.currentCity,
          profileCompletion: existingPhoneUser.profileCompletion,
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
      }

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
      createdFor: body.createdFor || 'Self',
      state: body.state || null,
      currentCity: body.currentCity || null,
      caste: body.caste || 'Bari',
      religion: 'Hindu',
      expectedCaste: 'Bari',
      maritalStatus: body.maritalStatus || null,
      height: body.height || null,
      diet: body.diet || null,
      education: body.education || null,
      income: body.income || null,
      workSector: body.workSector || null,
      occupation: body.occupation || null,
      profilePhoto: body.profilePhoto || null
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
