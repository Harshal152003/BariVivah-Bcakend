// /app/api/user/subscribe/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import Subscription from "@/models/Subscription";

export async function POST(req) {
  try {
    await connectDB();

    const { userId, planId, razorpay_payment_id } = await req.json();

    // 1. Validate required fields
    if (!userId || !planId || !razorpay_payment_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Fetch the selected subscription plan
    const plan = await Subscription.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Subscription plan not found" }, { status: 404 });
    }

    // 3. Calculate subscription expiry date
    const expiresAt = new Date(Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000);

    // 4. Update the user with subscription details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "subscription.plan": plan.name,
          "subscription.expiresAt": expiresAt,
          "subscription.transactionId": razorpay_payment_id,
          "subscription.subscriptionId": planId,
          "subscription.isSubscribed": true,
        },
      },
      { new: true } // returns the updated document
    );


    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "✅ Subscription updated", user: updatedUser });
  } catch (error) {
    console.error("❌ Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
