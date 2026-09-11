import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import DeletedAccount from '@/models/DeletedAccount';
import { verifyToken } from '@/lib/auth';
import otpStore from "@/lib/otpStore";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
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

    const body = await request.json();
    const { otp, reasonCategory, reasonText } = body;

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

    // Generate readable profileId if not explicitly stored
    const profileIdDisplay = user.profileId || (user._id ? `BV-${user._id.toString().slice(-5).toUpperCase()}` : '');

    // Archive deletion record with reasons and candidate metadata
    await DeletedAccount.create({
      userId: user._id.toString(),
      profileId: profileIdDisplay,
      name: user.name || 'Member',
      phone: user.phone || '',
      email: user.email || '',
      gender: user.gender || '',
      reasonCategory: reasonCategory === 'Married' ? 'Married' : 'Other',
      reasonText: reasonText || (reasonCategory === 'Married' ? 'Found life partner / Got married' : 'No details provided'),
      city: user.location?.currentCity || user.currentCity || user.currentAddress || user.parentResidenceCity || '',
      state: user.location?.state || user.state || '',
      plan: user.subscription?.plan || 'Free',
      registeredAt: user.createdAt || null,
      deletedAt: new Date(),
    });

    // Permanently delete user from DB
    await User.findByIdAndDelete(decoded.userId);

    // Clean up OTP store
    otpStore.delete(fullPhoneNumber);

    return NextResponse.json(
      { success: true, message: 'Account permanently deleted and archived' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting account:', error);
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