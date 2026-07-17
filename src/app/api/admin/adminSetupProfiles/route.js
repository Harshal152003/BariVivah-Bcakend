// File: src/app/api/admin/adminSetupProfiles/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    // Find users where profileSetup.willAdminFill is true
    const users = await User.find({
      'profileSetup.willAdminFill': true
    }).select('-password');

    return NextResponse.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Fetch failed' },
      { status: 500 }
    );
  }
}