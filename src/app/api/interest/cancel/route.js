import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    await connectDB();

    const { interestId, senderId, targetUserId } = await req.json();

    let query = {};
    if (interestId) {
      query._id = interestId;
    } else if (senderId && targetUserId) {
      query = { senderId, receiverId: targetUserId };
    } else {
      return NextResponse.json(
        { message: "Either interestId or (senderId and targetUserId) is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify interest exists first to provide descriptive error if already accepted
    const targetInterest = await Interest.findOne(query);
    if (!targetInterest) {
      return NextResponse.json(
        { message: "Interest request not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    if (targetInterest.status !== 'pending') {
      return NextResponse.json(
        { message: `Cannot withdraw request with status '${targetInterest.status}'. Only pending requests can be withdrawn.` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Delete the pending interest request from MongoDB
    const deletedInterest = await Interest.findByIdAndDelete(targetInterest._id);

    return NextResponse.json({
      success: true,
      message: "Request withdrawn successfully",
      withdrawnId: deletedInterest._id
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("Error in POST cancel interest:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
