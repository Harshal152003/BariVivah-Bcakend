import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Banner from "@/models/Banner";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req) {
  try {
    await connectDB();

    const banners = await Banner.find({})
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
    console.error("Error fetching admin banners:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch admin banners",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      title,
      imageUrl,
      targetUrl,
      targetType,
      isActive,
      order,
      startDate,
      endDate,
    } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and Image URL are required.",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const newBanner = new Banner({
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl ? targetUrl.trim() : "/(dashboard)/subscription",
      targetType: targetType || "in_app",
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? Number(order) : 0,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    await newBanner.save();

    return NextResponse.json(
      {
        success: true,
        message: "Banner created successfully!",
        banner: newBanner,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create banner",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
