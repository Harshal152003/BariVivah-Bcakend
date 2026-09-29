import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Expo } from 'expo-server-sdk';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function getUserIdFromRequest(request, fallbackBodyId = null) {
  let token = request.cookies.get('authToken')?.value;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.userId || decoded.id) return decoded.userId || decoded.id;
    } catch (err) {}
  }

  try {
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');
    if (queryUserId) return queryUserId;
  } catch (e) {}

  if (fallbackBodyId) return fallbackBodyId;
  return null;
}

// POST: Register or update device push token
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const userId = getUserIdFromRequest(request, body.userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { token, platform = 'android', deviceId = null } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Valid token is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!Expo.isExpoPushToken(token)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Expo push token format' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Remove this token from any other accounts (device ownership transfer/switch)
    await User.updateMany(
      { _id: { $ne: userId }, 'pushTokens.token': token },
      { $pull: { pushTokens: { token } } }
    );

    // 2. Remove existing instance of this token on current user to prevent duplicate entries
    await User.findByIdAndUpdate(userId, {
      $pull: { pushTokens: { token } },
    });

    // 3. Push fresh token entry with current timestamp
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          pushTokens: {
            token,
            platform: platform.toLowerCase(),
            deviceId,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    ).select('name phone profileId pushTokens');

    return NextResponse.json(
      {
        success: true,
        message: 'Push token registered successfully',
        registeredCount: updatedUser?.pushTokens?.length || 1,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[PushToken API] Registration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE: Deregister push token on logout
export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json().catch(() => ({}));
    const userId = getUserIdFromRequest(request, body.userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { token } = body;

    if (token) {
      await User.findByIdAndUpdate(userId, {
        $pull: { pushTokens: { token } },
      });
    } else {
      // Clear all tokens for user if no specific token supplied
      await User.findByIdAndUpdate(userId, {
        $set: { pushTokens: [] },
      });
    }

    return NextResponse.json(
      { success: true, message: 'Push token(s) deregistered successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[PushToken API] Deregistration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
