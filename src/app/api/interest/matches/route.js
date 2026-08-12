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
    const rawMatches = await Interest.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ],
      status: 'accepted'
    }).sort({ createdAt: -1 });

    // Deduplicate by partner User ID so each matched partner appears EXACTLY ONCE
    const uniqueMatchesMap = new Map();
    rawMatches.forEach((m) => {
      const partnerId = m.senderId.toString() === userId ? m.receiverId.toString() : m.senderId.toString();
      if (!uniqueMatchesMap.has(partnerId)) {
        uniqueMatchesMap.set(partnerId, m);
      }
    });

    const uniqueMatches = Array.from(uniqueMatchesMap.values());

    // Populate the other user's details for each unique match
    const populatedMatches = await Promise.all(
      uniqueMatches.map(async (match) => {
        const otherUserId = match.senderId.toString() === userId ? match.receiverId : match.senderId;
        const otherUser = await User.findById(otherUserId).select('-password');
        return {
          ...match._doc,
          matchedUser: otherUser
        };
      })
    );

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
