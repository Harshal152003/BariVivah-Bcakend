import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'Pending';

    let query = {};
    if (status !== 'all') {
      query.verificationStatus = status;
    } else {
      query.verificationRequested = true;
    }

    const users = await User.find(query)
      .select('name gender dob phone email profilePhoto verificationSelfieUrl verificationDocType verificationDocUrl verificationStatus isVerified verificationRejectReason verificationSubmittedAt')
      .sort({ verificationSubmittedAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, count: users.length, users },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[API admin/verifications GET Error]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification queue: ' + error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, action, rejectReason } = await req.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action (approve/reject) are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    let updateData = {};
    if (action === 'approve') {
      updateData = {
        isVerified: true,
        verificationStatus: 'Verified',
        verificationApprovedAt: new Date(),
        verificationRejectReason: null,
      };
    } else if (action === 'reject') {
      updateData = {
        isVerified: false,
        verificationStatus: 'Rejected',
        verificationRejectReason: rejectReason || 'Selfie pose or ID document verification failed.',
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid action parameter' },
        { status: 400, headers: corsHeaders }
      );
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `User verification ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        user: {
          id: user._id,
          name: user.name,
          isVerified: user.isVerified,
          verificationStatus: user.verificationStatus,
          verificationRejectReason: user.verificationRejectReason,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[API admin/verifications POST Error]:', error);
    return NextResponse.json(
      { error: 'Failed to process verification action: ' + error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
