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

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
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

    // Find all interests where (senderId === userId OR receiverId === userId) AND status === 'accepted'
    const matches = await Interest.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ],
      status: 'accepted'
    });

    // Get all unique user IDs involved in these matches
    const otherUserIds = matches.map(match => 
      match.senderId.toString() === userId ? match.receiverId : match.senderId
    );

    // Fetch all other users in a single query (optimized)
    const otherUsers = await User.find({ _id: { $in: otherUserIds } })
      .select('-password')
      .lean();

    // Create a map for quick lookup
    const userMap = {};
    otherUsers.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    // Attach the user details to each match
    const populatedMatches = matches.map(match => {
      const otherUserId = match.senderId.toString() === userId ? match.receiverId.toString() : match.senderId.toString();
      return {
        ...(match._doc || match),
        matchedUser: userMap[otherUserId] || null
      };
    });

    return NextResponse.json({ 
      success: true,
      count: populatedMatches.length,
      matches: populatedMatches 
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("Error fetching matches:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Internal server error",
        error: error.message 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
