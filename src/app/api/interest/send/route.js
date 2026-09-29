import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { sendPushNotification } from "@/lib/pushDispatcher";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081', // Must be explicit, not *
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};
export async function POST(req) {
  try {
    await connectDB();
    const { senderId, receiverId } = await req.json();
    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", receiverId);
    // Validate input
    if (!senderId || !receiverId) {
      return NextResponse.json(
        { message: "Both senderId and receiverId are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if users exist and are active
    const senderExists = await User.findById(senderId);
    const receiverExists = await User.findById(receiverId);

    if (!senderExists || !receiverExists) {
      return NextResponse.json(
        { message: "Either sender or receiver does not exist" },
        { status: 404, headers: corsHeaders }
      );
    }

    if (receiverExists.isDeleted || receiverExists.status === 'Deleted') {
      return NextResponse.json(
        { message: "This member's profile is closed and no longer accepting interest requests." },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user already sent interest to receiver
    const existingOutbound = await Interest.findOne({ senderId, receiverId });
    if (existingOutbound) {
      return NextResponse.json(
        { message: "Interest already sent to this member", isAlreadySent: true },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if reverse interest exists (receiver previously sent interest to sender)
    const reverseInterest = await Interest.findOne({ senderId: receiverId, receiverId: senderId });
    if (reverseInterest) {
      if (reverseInterest.status === 'pending') {
        // Auto-match! Receiver previously sent interest, and now sender responds
        reverseInterest.status = 'accepted';
        await reverseInterest.save();

        // Extract candidate profile photos
        const senderPhotoUrl = senderExists.photos?.find(p => p.isPrimary)?.url || senderExists.photos?.[0]?.url || senderExists.profilePhoto || null;
        const receiverPhotoUrl = receiverExists.photos?.find(p => p.isPrimary)?.url || receiverExists.photos?.[0]?.url || receiverExists.profilePhoto || null;

        // Create match notifications for both users
        try {
          await Notification.create([
            {
              title: "Request Accepted & Matched!",
              message: `It's a Match! You and ${senderExists.name || 'a member'} both expressed interest in each other.`,
              type: "INTEREST",
              priority: "HIGH",
              recipientType: "SPECIFIC",
              recipientUser: receiverId,
              senderUser: senderId,
              senderPhoto: senderPhotoUrl,
              senderGender: senderExists.gender || 'Other',
              actionUrl: "/(dashboard)/(tabs)/matches",
              createdBy: "SYSTEM",
            },
            {
              title: "Request Accepted & Matched!",
              message: `It's a Match! You and ${receiverExists.name || 'a member'} both expressed interest in each other.`,
              type: "INTEREST",
              priority: "HIGH",
              recipientType: "SPECIFIC",
              recipientUser: senderId,
              senderUser: receiverId,
              senderPhoto: receiverPhotoUrl,
              senderGender: receiverExists.gender || 'Other',
              actionUrl: "/(dashboard)/(tabs)/matches",
              createdBy: "SYSTEM",
            },
          ]);

          // Push notifications to both users for instant match
          sendPushNotification({
            recipientUserIds: [receiverId, senderId],
            title: "It's a Match! 💍",
            body: `You and ${senderExists.name || 'a member'} matched with each other!`,
            data: { url: '/(dashboard)/(tabs)/matches', tab: 'matches' },
            channelId: 'matrimony_matches',
            category: 'matchAlerts',
          }).catch((e) => console.warn('Push dispatch error on match:', e));
        } catch (notifErr) {
          console.warn("Match notification creation failed:", notifErr);
        }

        return NextResponse.json({
          message: "It's a Match! You both expressed interest in each other.",
          isMatch: true,
          interest: {
            ...reverseInterest._doc,
            sender: senderExists,
            receiver: receiverExists
          }
        }, { headers: corsHeaders });
      } else if (reverseInterest.status === 'accepted') {
        return NextResponse.json({
          message: "You are already matched with this member!",
          isMatch: true,
          interest: reverseInterest
        }, { status: 400, headers: corsHeaders });
      }
    }

    // Create new interest
    const interest = new Interest({ senderId, receiverId, status: 'pending' });
    await interest.save();

    // Extract sender photo
    const senderPhotoUrl = senderExists.photos?.find(p => p.isPrimary)?.url || senderExists.photos?.[0]?.url || senderExists.profilePhoto || null;

    // Create incoming request notification for receiver
    try {
      await Notification.create({
        title: "New Connection Request",
        message: `${senderExists.name || 'A BariVivah member'} has sent you a connection request!`,
        type: "INTEREST",
        priority: "HIGH",
        recipientType: "SPECIFIC",
        recipientUser: receiverId,
        senderUser: senderId,
        senderPhoto: senderPhotoUrl,
        senderGender: senderExists.gender || 'Other',
        actionUrl: "/(dashboard)/(tabs)/matches",
        createdBy: "SYSTEM",
      });

      // Push notification for incoming request
      sendPushNotification({
        recipientUserIds: receiverId,
        title: "New Connection Request 💌",
        body: `${senderExists.name || 'A member'} sent you a connection request!`,
        data: { url: '/(dashboard)/(tabs)/matches', tab: 'received' },
        channelId: 'matrimony_requests',
        category: 'requestAlerts',
      }).catch((e) => console.warn('Push dispatch error on request:', e));
    } catch (notifErr) {
      console.warn("Incoming interest notification creation failed:", notifErr);
    }

    return NextResponse.json({
      message: "Interest sent successfully",
      interest: {
        ...interest._doc,
        sender: senderExists,
        receiver: receiverExists
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("Error in POST interest:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Find all interests where the user is the sender
    const interests = await Interest.find({ senderId: userId });

    // Collect unique receiver IDs
    const receiverIds = [...new Set(interests.map(interest => interest.receiverId.toString()))];

    // Fetch all required users in a single query (optimized)
    const users = await User.find({ _id: { $in: [userId, ...receiverIds] } })
      .select('-password')
      .lean();

    // Create a map for quick lookup
    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    const senderUser = userMap[userId] || null;

    // Attach sender and receiver details with soft-delete safety
    const populatedInterests = interests.map(interest => {
      const rawReceiver = userMap[interest.receiverId.toString()];
      let receiver;
      if (!rawReceiver || rawReceiver.isDeleted || rawReceiver.status === 'Deleted') {
        receiver = {
          _id: interest.receiverId,
          name: 'Member (Profile Closed)',
          profilePhoto: null,
          isDeleted: true,
          status: 'Deleted',
          education: 'Profile Closed',
          currentCity: 'Unavailable',
          caste: 'Bari',
          message: 'This member is no longer on BariVivah.'
        };
      } else {
        receiver = rawReceiver;
      }

      return {
        ...(interest._doc || interest),
        sender: senderUser,
        receiver
      };
    });

    return NextResponse.json({
      success: true,
      interests: populatedInterests
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("Error in GET interests:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}