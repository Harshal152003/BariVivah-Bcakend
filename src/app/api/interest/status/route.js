import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";
import User from "@/models/User";
import Notification from "@/models/Notification";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:8081', // Must be explicit, not *
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PATCH(req) {
  await connectDB();

  const { interestId, status } = await req.json();
  console.log("Interest ID:", interestId);
  console.log("Status:", status);
  if (!interestId || !["accepted", "declined"].includes(status)) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400, headers: corsHeaders });
  }

  const interest = await Interest.findById(interestId);
  if (!interest) {
    return NextResponse.json({ message: "Interest not found" }, { status: 404, headers: corsHeaders });
  }

  interest.status = status;
  await interest.save();

  // If status is accepted, send notification to sender
  if (status === "accepted") {
    try {
      const sender = await User.findById(interest.senderId);
      const receiver = await User.findById(interest.receiverId);

      if (sender && receiver) {
        await Notification.create({
          title: "Request Accepted!",
          message: `${receiver.name || 'A BariVivah member'} accepted your connection request! You can now view each other's details.`,
          type: "INTEREST",
          priority: "HIGH",
          recipientType: "SPECIFIC",
          recipientUser: interest.senderId,
          actionUrl: "/(dashboard)/(tabs)/matches",
          createdBy: "SYSTEM",
        });
      }
    } catch (notifErr) {
      console.warn("Accepted notification error:", notifErr);
    }
  }

  return NextResponse.json({ message: "Status updated", interest }, { headers: corsHeaders });
}
// This route updates the status of an interest (accepted or declined).