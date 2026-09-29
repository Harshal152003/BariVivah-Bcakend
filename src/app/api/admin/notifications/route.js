import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { sendPushNotification } from '@/lib/pushDispatcher';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 30;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({})
        .populate('recipientUser', 'name profileId phone gender email profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({}),
    ]);

    const formatted = notifications.map((n) => ({
      _id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      priority: n.priority,
      recipientType: n.recipientType,
      targetGroup: n.targetGroup,
      recipientUser: n.recipientUser || null,
      actionUrl: n.actionUrl,
      readCount: Array.isArray(n.readBy) ? n.readBy.length : (n.isRead ? 1 : 0),
      createdBy: n.createdBy,
      createdAt: n.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin Notifications GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch admin notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      title,
      message,
      type = 'ADMIN_BROADCAST',
      priority = 'NORMAL',
      recipientType = 'ALL',
      userQuery, // Can be ObjectId, profileId (BV-XXXXXX), phone, or email
      targetGroup = 'ALL',
      actionUrl = null,
    } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: 'Title and Message are required' },
        { status: 400 }
      );
    }

    let recipientUser = null;

    if (recipientType === 'SPECIFIC') {
      if (!userQuery) {
        return NextResponse.json(
          { success: false, message: 'Recipient user ID, profile ID, or phone is required for specific notifications' },
          { status: 400 }
        );
      }

      const q = String(userQuery).trim();
      let foundUser = null;

      if (mongoose.Types.ObjectId.isValid(q)) {
        foundUser = await User.findById(q).select('_id name profileId phone gender').lean();
      }

      if (!foundUser) {
        // Try profileId (with or without BV-) or phone or email
        const cleanProfileId = q.toUpperCase().startsWith('BV-') ? q.toUpperCase() : `BV-${q.toUpperCase()}`;
        foundUser = await User.findOne({
          $or: [
            { profileId: new RegExp(`^${cleanProfileId}$`, 'i') },
            { profileId: new RegExp(`^${q}$`, 'i') },
            { phone: q },
            { email: q.toLowerCase() },
          ],
        }).select('_id name profileId phone gender').lean();
      }

      if (!foundUser) {
        return NextResponse.json(
          { success: false, message: `Could not find any user matching "${userQuery}"` },
          { status: 404 }
        );
      }

      recipientUser = foundUser._id;
    }

    const newNotification = await Notification.create({
      title: title.trim(),
      message: message.trim(),
      type,
      priority,
      recipientType,
      recipientUser,
      targetGroup: recipientType === 'GROUP' ? targetGroup : 'ALL',
      actionUrl: actionUrl || null,
      createdBy: 'ADMIN',
      readBy: [],
      isRead: false,
    });

    const populated = await Notification.findById(newNotification._id)
      .populate('recipientUser', 'name profileId phone gender email profilePhoto')
      .lean();

    // Asynchronously dispatch push notifications based on recipientType
    (async () => {
      try {
        let targetUserIds = [];

        if (recipientType === 'SPECIFIC' && recipientUser) {
          targetUserIds = [recipientUser];
        } else if (recipientType === 'ALL') {
          const allUsers = await User.find({ isDeleted: { $ne: true } }).select('_id').lean();
          targetUserIds = allUsers.map((u) => u._id);
        } else if (recipientType === 'GROUP') {
          let filter = { isDeleted: { $ne: true } };
          if (targetGroup === 'MALE') filter.gender = 'Male';
          if (targetGroup === 'FEMALE') filter.gender = 'Female';
          if (targetGroup === 'VERIFIED') filter.$or = [{ isVerified: true }, { verificationStatus: 'Verified' }];
          if (targetGroup === 'UNVERIFIED') filter.$and = [{ isVerified: { $ne: true } }, { verificationStatus: { $ne: 'Verified' } }];
          if (targetGroup === 'PREMIUM_USERS') filter['subscription.isSubscribed'] = true;
          if (targetGroup === 'FREE_USERS') filter.$or = [{ 'subscription.isSubscribed': false }, { subscription: { $exists: false } }];

          const groupUsers = await User.find(filter).select('_id').lean();
          targetUserIds = groupUsers.map((u) => u._id);
        }

        if (targetUserIds.length > 0) {
          await sendPushNotification({
            recipientUserIds: targetUserIds,
            title: title.trim(),
            body: message.trim(),
            data: {
              url: actionUrl || null,
              notificationId: newNotification._id.toString(),
            },
            channelId: 'matrimony_announcements',
            category: 'adminAnnouncements',
          });
        }
      } catch (pushErr) {
        console.warn('[AdminNotifications] Push broadcast error:', pushErr);
      }
    })();

    return NextResponse.json({
      success: true,
      message: 'Notification successfully created and queued for broadcast',
      data: populated,
    });
  } catch (error) {
    console.error('Admin Notifications POST Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create notification' },
      { status: 500 }
    );
  }
}
