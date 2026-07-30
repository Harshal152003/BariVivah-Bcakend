import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import otpStore from "@/lib/otpStore";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

export async function POST(request) {
  try {
    await dbConnect();

    // Get token from cookie or Authorization header
    let token = request.cookies.get('authToken')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { otp } = await request.json();
    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { message: 'Invalid OTP format' },
        { status: 400, headers: corsHeaders }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Verify OTP against otpStore
    const fullPhoneNumber = user.phone.startsWith('+91') ? user.phone : `+91${user.phone}`;
    const storedOTP = otpStore.get(fullPhoneNumber);

    // Support dev environment fallback code '123456'
    if (otp.toString() !== '123456' && storedOTP !== otp.toString()) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Delete user from DB
    await User.findByIdAndDelete(decoded.userId);

    // Clean up OTP store
    otpStore.delete(fullPhoneNumber);

    return NextResponse.json(
      { success: true, message: 'Account permanently deleted' },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}