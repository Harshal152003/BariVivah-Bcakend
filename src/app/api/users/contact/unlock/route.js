import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import ContactUnlock from '@/models/ContactUnlock';
import { verifyToken } from '@/lib/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

function getUserIdFromRequest(request) {
  let token = request.cookies.get('authToken')?.value;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

export async function POST(request) {
  await connectDB();

  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
  }

  const { targetUserId } = await request.json();
  if (!targetUserId) {
    return NextResponse.json({ error: 'Missing targetUserId' }, { status: 400, headers: corsHeaders });
  }

  try {
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404, headers: corsHeaders });
    }

    // 1. Check if already unlocked
    const alreadyUnlocked = await ContactUnlock.findOne({ userId, unlockedUserId: targetUserId });
    if (alreadyUnlocked) {
      return NextResponse.json({
        success: true,
        unlocked: true,
        contactNumber: targetUser.phone || 'N/A'
      }, { status: 200, headers: corsHeaders });
    }

    // Fetch current user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders });
    }

    // 2. Verify active subscription
    const isSubscribed = user.subscription && user.subscription.isSubscribed;
    const isNotExpired = user.subscription && user.subscription.expiresAt && (new Date() < new Date(user.subscription.expiresAt));

    if (!isSubscribed || !isNotExpired) {
      return NextResponse.json({ error: 'No active subscription. Please upgrade or renew your plan.' }, { status: 403, headers: corsHeaders });
    }

    // 3. Verify limit
    const limit = user.subscription.contactUnlockLimit || 0;
    const used = user.subscription.contactsUsed || 0;

    if (used >= limit) {
      return NextResponse.json({ error: 'You have reached your contact unlock limit. Please upgrade your plan.' }, { status: 403, headers: corsHeaders });
    }

    // 4. Register unlock in ContactUnlock collection
    let unlockRecord;
    try {
      unlockRecord = await ContactUnlock.create({ userId, unlockedUserId: targetUserId });
    } catch (e) {
      if (e.code === 11000) {
        // Race condition duplicate, already unlocked
        return NextResponse.json({
          success: true,
          unlocked: true,
          contactNumber: targetUser.phone || 'N/A'
        }, { status: 200, headers: corsHeaders });
      }
      throw e;
    }

    // 5. Increment contactsUsed atomically
    const updateResult = await User.updateOne(
      {
        _id: userId,
        "subscription.isSubscribed": true,
        "subscription.expiresAt": { $gt: new Date() },
        "subscription.contactsUsed": { $lt: limit }
      },
      {
        $inc: { "subscription.contactsUsed": 1 }
      }
    );

    if (updateResult.modifiedCount === 0) {
      // Rollback the created unlock record since atomic update failed (limit hit)
      await ContactUnlock.deleteOne({ _id: unlockRecord._id });
      return NextResponse.json({ error: 'Failed to unlock. Limit exceeded or subscription expired.' }, { status: 403, headers: corsHeaders });
    }

    // Fetch updated user to get new count
    const updatedUser = await User.findById(userId);

    return NextResponse.json({
      success: true,
      unlocked: true,
      contactNumber: targetUser.phone || 'N/A',
      contactsUsed: updatedUser.subscription.contactsUsed,
      contactUnlockLimit: updatedUser.subscription.contactUnlockLimit
    }, { status: 200, headers: corsHeaders });

  } catch (err) {
    console.error('Error unlocking contact:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
