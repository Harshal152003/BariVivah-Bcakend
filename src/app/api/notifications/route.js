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
      .populate('senderUser', 'name gender photos profilePhoto')
      .sort({ createdAt: -1 })
      .limit(60)
      .lean();

    // Collect names for notifications that lack senderPhoto / senderUser for backward compatibility
    const missingSenderNames = [];
    rawNotifications.forEach((notif) => {
      if (notif.type === 'INTEREST' && !notif.senderPhoto && (!notif.senderUser || !notif.senderUser.photos)) {
        const msg = notif.message || '';
        const match1 = msg.match(/^(.+?)\s+(?:has\s+sent|sent)\s+you/i);
        const match2 = msg.match(/You and\s+(.+?)\s+both/i);
        const match3 = msg.match(/^(.+?)\s+accepted\s+your/i);
        const extracted = (match1 && match1[1]) || (match2 && match2[1]) || (match3 && match3[1]);
        if (extracted && extracted !== 'A BariVivah member' && extracted !== 'A member') {
          missingSenderNames.push(extracted.trim());
        }
      }
    });

    // Bulk find users by name if any missing
    const userByNameMap = {};
    if (missingSenderNames.length > 0) {
      try {
        const foundUsers = await User.find({
          name: { $in: missingSenderNames.map((n) => new RegExp('^' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')) },
        })
          .select('name gender photos profilePhoto')
          .lean();

        foundUsers.forEach((u) => {
          if (u.name) {
            userByNameMap[u.name.toLowerCase()] = u;
          }
        });
      } catch (e) {
        console.warn('Fallback sender user resolution error:', e);
      }
    }

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

      // Extract resolved photo & gender
      let resolvedPhoto = notif.senderPhoto || null;
      let resolvedGender = notif.senderGender || null;

      if (!resolvedPhoto && notif.senderUser && typeof notif.senderUser === 'object') {
        resolvedPhoto =
          notif.senderUser.photos?.find((p) => p.isPrimary)?.url ||
          notif.senderUser.photos?.[0]?.url ||
          notif.senderUser.profilePhoto ||
          null;
        if (!resolvedGender) {
          resolvedGender = notif.senderUser.gender || null;
        }
      }

      if (!resolvedPhoto && notif.type === 'INTEREST') {
        const msg = notif.message || '';
        const match1 = msg.match(/^(.+?)\s+(?:has\s+sent|sent)\s+you/i);
        const match2 = msg.match(/You and\s+(.+?)\s+both/i);
        const match3 = msg.match(/^(.+?)\s+accepted\s+your/i);
        const extracted = (match1 && match1[1]) || (match2 && match2[1]) || (match3 && match3[1]);
        if (extracted && userByNameMap[extracted.toLowerCase()]) {
          const fallbackUser = userByNameMap[extracted.toLowerCase()];
          resolvedPhoto =
            fallbackUser.photos?.find((p) => p.isPrimary)?.url ||
            fallbackUser.photos?.[0]?.url ||
            fallbackUser.profilePhoto ||
            null;
          if (!resolvedGender) {
            resolvedGender = fallbackUser.gender || null;
          }
        }
      }

      return {
        _id: notif._id,
        id: notif._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        priority: notif.priority,
        actionUrl: notif.actionUrl,
        senderPhoto: resolvedPhoto,
        senderGender: resolvedGender,
        senderUser: notif.senderUser?._id || notif.senderUser || null,
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
