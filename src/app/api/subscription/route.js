// src/app/api/subscription/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subscription from "@/models/Subscription";

import User from "@/models/User";

// POST /api/subscription - Create new subscription
// POST /api/subscription - Subscribe user (Update User only, do NOT create new Plan)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    // console.log("POST Body:", body);

    // CRITICAL FIX: Do NOT save a new Subscription document here.
    // The 'Subscription' collection is for PLAN TEMPLATES only (created by Admin/Seed).
    // Use the data to update the User's subscription status.

    // Validate essential data
    if (!body.userId || !body.name || !body.durationInDays) {
      return NextResponse.json(
        { message: "Missing required subscription data (userId, name, duration)" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      body.userId,
      {
        subscription: {
          plan: body.name,
          isSubscribed: true,
          expiresAt: new Date(
            Date.now() + body.durationInDays * 24 * 60 * 60 * 1000
          ),
          transactionId: body.razorpay_payment_id || 'manual_update',
          // If the frontend sends the plan ID, save it. Otherwise, we can leave it null or look it up.
          // For now, trusting the flow ensures we don't break the frontend.
          subscriptionId: body._id || null
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
      subscription: updatedUser.subscription
    }, { status: 200 });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { message: "Failed to create", error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/subscription - Fetch all subscriptions
export async function GET() {
  try {
    await connectDB();
    const plans = await Subscription.find();

    // Filter out "Messaging" related features dynamically
    const cleanedPlans = plans.map(plan => {
      // Convert Mongoose document to plain object if needed, or just clone it
      const planObj = plan.toObject ? plan.toObject() : { ...plan };

      if (planObj.features && Array.isArray(planObj.features)) {
        planObj.features = planObj.features.filter(feature => {
          const lowerFeature = feature.toLowerCase();
          return !lowerFeature.includes('message') &&
            !lowerFeature.includes('chat') &&
            !lowerFeature.includes('communication');
        });
      }
      return planObj;
    });

    return NextResponse.json(cleanedPlans);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch", error: error.message },
      { status: 500 }
    );
  }
}
