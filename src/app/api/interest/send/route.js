import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";
import User from "@/models/User"; // Import User model
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
        { status: 400,headers:corsHeaders }
      );
    }

    // Check if users exist
    const senderExists = await User.findById(senderId);
    const receiverExists = await User.findById(receiverId);
    
    if (!senderExists || !receiverExists) {
      return NextResponse.json(
        { message: "Either sender or receiver does not exist" },
        { status: 404 ,headers:corsHeaders}
      );
    }

    // Check for existing interest
    const existing = await Interest.findOne({ senderId, receiverId });
    if (existing) {
      return NextResponse.json(
        { message: "Interest already sent" },
        { status: 400 ,headers:corsHeaders}
      );
    }

    // Create new interest
    const interest = new Interest({ senderId, receiverId });
    await interest.save();

    return NextResponse.json({ 
      message: "Interest sent successfully",
      interest: {
        ...interest._doc,
        sender: senderExists,
        receiver: receiverExists
      }
    },{headers:corsHeaders});

  } catch (error) {
    console.error("Error in POST interest:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500,headers:corsHeaders }
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
        { status: 400,headers:corsHeaders }
      );
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404,headers:corsHeaders }
      );
    }

    // Find all interests where the user is the sender
    const interests = await Interest.find({ senderId: userId });

    // Populate sender and receiver details
    const populatedInterests = await Promise.all(
      interests.map(async (interest) => {
        const sender = await User.findById(interest.senderId).select('-password'); // Exclude sensitive data
        const receiver = await User.findById(interest.receiverId).select('-password');
        return {
          ...interest._doc,
          sender,
          receiver
        };
      })
    );

    return NextResponse.json({ 
      success: true,
      interests: populatedInterests 
    },{headers:corsHeaders});

  } catch (error) {
    console.error("Error in GET interests:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500,headers:corsHeaders }
    );
  }
}