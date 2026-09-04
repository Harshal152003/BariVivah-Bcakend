import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Banner from "@/models/Banner";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const banner = await Banner.findById(id);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found." },
        { status: 404, headers: corsHeaders }
      );
    }

    if (body.title !== undefined) banner.title = body.title.trim();
    if (body.imageUrl !== undefined) banner.imageUrl = body.imageUrl.trim();
    if (body.targetUrl !== undefined) banner.targetUrl = body.targetUrl.trim();
    if (body.targetType !== undefined) banner.targetType = body.targetType;
    if (body.isActive !== undefined) banner.isActive = Boolean(body.isActive);
    if (body.order !== undefined) banner.order = Number(body.order);
    if (body.startDate !== undefined) banner.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined) banner.endDate = body.endDate ? new Date(body.endDate) : null;

    await banner.save();

    return NextResponse.json(
      {
        success: true,
        message: "Banner updated successfully!",
        banner,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update banner",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found." },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Banner deleted successfully!",
        deletedId: id,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete banner",
        error: error.message,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
