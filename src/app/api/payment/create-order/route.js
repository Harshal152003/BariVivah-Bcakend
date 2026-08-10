// /app/api/payment/create-order/route.js

import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

export async function POST(req) {
  
  const { userId, planId } = await req.json();

  if (!userId || !planId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    // ✅ 1. Get the actual plan from DB using planId
    const plan = await Subscription.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // ✅ 2. Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // ✅ 3. Create the order with actual plan price (in paise)
    const options = {
      amount: plan.price * 100, // ₹499 → 49900 paise
      currency: "INR",
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order, { status: 200 });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}
