import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";
import User from "@/models/User";
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081', // Must be explicit, not *
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    // Validate input
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 ,headers:corsHeaders}
      );
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 ,headers:corsHeaders}
      );
    }

    // Find all interests where the user is the receiver
    const interests = await Interest.find({ receiverId: userId });

    // Collect unique sender IDs
    const senderIds = [...new Set(interests.map(interest => interest.senderId.toString()))];

    // Fetch all required users in a single query (optimized)
    const users = await User.find({ _id: { $in: [userId, ...senderIds] } })
      .select('-password')
      .lean();

    // Create a map for quick lookup
    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    const receiverUser = userMap[userId] || null;

    // Attach sender and receiver details with soft-delete safety
    const populatedInterests = interests.map(interest => {
      const rawSender = userMap[interest.senderId.toString()];
      let sender;
      if (!rawSender || rawSender.isDeleted || rawSender.status === 'Deleted') {
        sender = {
          _id: interest.senderId,
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
        sender = rawSender;
      }

      return {
        ...(interest._doc || interest),
        sender,
        receiver: receiverUser
      };
    });

    return NextResponse.json({ 
      success: true,
      count: populatedInterests.length,
      interests: populatedInterests 
    },{headers:corsHeaders});

  } catch (error) {
    console.error("Error fetching received interests:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal server error",
        error: error.message 
      },
      { status: 500,headers:corsHeaders }
    );
  }
}