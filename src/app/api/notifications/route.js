import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

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
    } catch (err) {
      // Continue to fallback
    }
  }

  try {
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');
    if (queryUserId) return queryUserId;
  } catch (e) {}

  if (fallbackBodyId) return fallbackBodyId;
  return null;
}

export async function GET(request) {
  try {
    await dbConnect();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const isPremium = Boolean(
      user.isPremium ||
      (user.subscription?.isSubscribed && (!user.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date())) ||
      (user.subscription?.plan && String(user.subscription.plan).toLowerCase() !== 'free')
    );

    const isVerified = Boolean(user.isVerified || user.verificationStatus === 'Verified');
    const gender = user.gender || 'Other';

    // Determine matching group targets for this user
    const matchingGroups = ['ALL'];
    if (isPremium) {
      matchingGroups.push('PREMIUM_USERS');
    } else {
      matchingGroups.push('FREE_USERS');
    }

    if (gender === 'Male') matchingGroups.push('MALE');
    if (gender === 'Female') matchingGroups.push('FEMALE');

    if (isVerified) {
      matchingGroups.push('VERIFIED');
    } else {
      matchingGroups.push('UNVERIFIED');
    }

    // Query notifications
    const query = {
      $or: [
        { recipientType: 'ALL' },
        { recipientType: 'SPECIFIC', recipientUser: userId },
        { recipientType: 'GROUP', targetGroup: { $in: matchingGroups } },
      ],
    };

    const rawNotifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(60)
      .lean();

    const userIdStr = userId.toString();

    let unreadCount = 0;
    const notifications = rawNotifications.map((notif) => {
      let isRead = false;
      if (notif.recipientType === 'SPECIFIC') {
        isRead = Boolean(notif.isRead);
      } else {
        isRead = Array.isArray(notif.readBy) && notif.readBy.some(
          (r) => r.userId && r.userId.toString() === userIdStr
        );
      }

      if (!isRead) {
        unreadCount++;
      }

      return {
        _id: notif._id,
        id: notif._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        priority: notif.priority,
        actionUrl: notif.actionUrl,
        isRead,
        createdAt: notif.createdAt,
        createdBy: notif.createdBy,
        recipientType: notif.recipientType,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        total: notifications.length,
      },
    });
  } catch (error) {
    console.error('Notifications GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json().catch(() => ({}));
    const { notificationId, markAll, userId: bodyUserId } = body;

    const userId = getUserIdFromRequest(request, bodyUserId);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const userIdStr = userId.toString();

    if (markAll) {
      // 1. Mark all specific notifications as isRead: true
      await Notification.updateMany(
        { recipientType: 'SPECIFIC', recipientUser: userId, isRead: false },
        { $set: { isRead: true } }
      );

      // 2. Add userId to readBy array for all ALL and GROUP notifications where not already present
      await Notification.updateMany(
        {
          recipientType: { $in: ['ALL', 'GROUP'] },
          'readBy.userId': { $ne: userId },
        },
        {
          $addToSet: {
            readBy: {
              userId,
              readAt: new Date(),
            },
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    }

    if (notificationId) {
      const notif = await Notification.findById(notificationId);
      if (!notif) {
        return NextResponse.json(
          { success: false, message: 'Notification not found' },
          { status: 404 }
        );
      }

      if (notif.recipientType === 'SPECIFIC') {
        notif.isRead = true;
        await notif.save();
      } else {
        const alreadyRead = notif.readBy.some(
          (r) => r.userId && r.userId.toString() === userIdStr
        );
        if (!alreadyRead) {
          notif.readBy.push({ userId, readAt: new Date() });
          await notif.save();
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid request payload' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Notifications POST Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update notification status' },
      { status: 500 }
    );
  }
}
