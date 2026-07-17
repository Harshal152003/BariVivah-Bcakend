// src/app/api/subscription/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subscription from "@/models/Subscription";
import User from "@/models/User";

// POST /api/subscription - Handles both User subscribing and Admin creating plan template
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Check if it is a User subscribing (userId present)
    if (body.userId) {
      if (!body.name || !body.durationInDays) {
        return NextResponse.json(
          { message: "Missing required subscription data (name, duration)" },
          { status: 400 }
        );
      }

      // Look up user first
      const user = await User.findById(body.userId);
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      // Look up subscription plan details
      const planId = body.subscriptionId || body._id || body.planId;
      let plan = null;
      if (planId) {
        plan = await Subscription.findById(planId);
      }
      if (!plan) {
        plan = await Subscription.findOne({ name: body.name });
      }

      // Option A upgrade flow: check if current subscription is active to keep contactsUsed
      let contactsUsed = 0;
      const isCurrentlySubscribed = user.subscription && user.subscription.isSubscribed && new Date() < new Date(user.subscription.expiresAt);
      if (isCurrentlySubscribed) {
        contactsUsed = user.subscription.contactsUsed || 0;
      }

      const duration = parseInt(body.durationInDays) || plan?.durationInDays || 30;
      const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);

      user.subscription = {
        plan: body.name.trim(),
        isSubscribed: true,
        startDate: new Date(),
        expiresAt: expiresAt,
        transactionId: body.razorpay_payment_id || 'manual_update',
        subscriptionId: plan?._id || null,
        contactUnlockLimit: plan?.features?.contactUnlockLimit || 0,
        contactsUsed: contactsUsed,
        chatEnabled: plan?.features?.chatEnabled || false,
        visitorHistory: plan?.features?.visitorHistory || false,
        profileBoosts: plan?.features?.profileBoosts || 0,
        advancedFilters: plan?.features?.advancedFilters || false
      };

      const updatedUser = await user.save();
      return NextResponse.json({
        success: true,
        message: "Subscription updated successfully",
        subscription: updatedUser.subscription
      }, { status: 200 });

    } else {
      // Admin flow: Create a new Plan Template
      if (!body.name || body.price === undefined || !body.durationInDays) {
        return NextResponse.json(
          { message: "Missing required fields (name, price, durationInDays)" },
          { status: 400 }
        );
      }

      const newPlan = await Subscription.create({
        name: body.name,
        price: body.price,
        durationInDays: body.durationInDays,
        features: body.features || {
          contactUnlockLimit: 0,
          chatEnabled: false,
          visitorHistory: false,
          profileBoosts: 0,
          advancedFilters: false
        },
        displayFeatures: body.displayFeatures || [],
        isActive: body.isActive !== undefined ? body.isActive : true
      });

      return NextResponse.json(newPlan, { status: 201 });
    }

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

    // Filter out "Messaging" related features dynamically for client views
    const cleanedPlans = plans.map(plan => {
      const planObj = plan.toObject ? plan.toObject() : { ...plan };

      if (planObj.displayFeatures && Array.isArray(planObj.displayFeatures)) {
        planObj.displayFeatures = planObj.displayFeatures.filter(feature => {
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
