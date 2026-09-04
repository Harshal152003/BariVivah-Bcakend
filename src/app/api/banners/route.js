import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Banner from "@/models/Banner";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req) {
  try {
    await connectDB();

    const now = new Date();
    // Query active banners within valid scheduling window (if dates are specified)
    const banners = await Banner.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: now } },
          ],
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } },
          ],
        },
      ],
    })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: banners.length,
        banners,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching active banners:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch banners",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
