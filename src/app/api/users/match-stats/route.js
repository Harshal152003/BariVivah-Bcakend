import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Interest from "@/models/Interest";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

const getCorsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
});

export async function GET(request) {
  const origin = request.headers.get("origin");
  const headers = getCorsHeaders(origin);

  try {
    await dbConnect();

    // Extract token from cookie or Authorization header
    let token = request.cookies.get("authToken")?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized: Missing token" }),
        { status: 401, headers }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized: Invalid token" }),
        { status: 401, headers }
      );
    }

    const userId = decoded.userId;

    // Fetch the current user to get their gender
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers }
      );
    }

    const oppositeGender = currentUser.gender === "Male" ? "Female" : currentUser.gender === "Female" ? "Male" : "";

    // 1. Total Matches
    let totalMatches = 0;
    if (oppositeGender) {
      totalMatches = await User.countDocuments({
        _id: { $ne: userId },
        gender: oppositeGender,
      });
    } else {
      // If user gender is not set, match all other users
      totalMatches = await User.countDocuments({
        _id: { $ne: userId },
      });
    }

    // 2. New Matches (registered in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    let newMatches = 0;
    if (oppositeGender) {
      newMatches = await User.countDocuments({
        _id: { $ne: userId },
        gender: oppositeGender,
        createdAt: { $gte: sevenDaysAgo },
      });
    } else {
      newMatches = await User.countDocuments({
        _id: { $ne: userId },
        createdAt: { $gte: sevenDaysAgo },
      });
    }

    // 3. Interests Received (receiver is current user, status is pending)
    const interestsReceived = await Interest.countDocuments({
      receiverId: userId,
      status: "pending",
    });

    // 4. Conversations (mutual accepted interests where user is sender or receiver)
    const conversations = await Interest.countDocuments({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ],
      status: "accepted",
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        stats: {
          totalMatches,
          newMatches,
          interestsReceived,
          conversations,
        },
      }),
      { headers }
    );

  } catch (error) {
    console.error("Error fetching match stats:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error", details: error.message }),
      { status: 500, headers }
    );
  }
}

export async function OPTIONS(request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    headers: getCorsHeaders(origin),
  });
}
