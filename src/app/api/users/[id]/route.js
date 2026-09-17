// /app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return NextResponse.json({
        error: "User not found",
        isDeleted: true,
        message: "This member profile does not exist."
      }, { status: 404 });
    }

    if (user.isDeleted || user.status === 'Deleted' || (typeof user.phone === 'string' && user.phone.startsWith('DELETED_'))) {
      return NextResponse.json({
        error: "Profile Closed",
        isDeleted: true,
        status: "Deleted",
        name: "Member (Profile Closed)",
        message: "This member has closed their account or found a life partner and is no longer active on BariVivah."
      }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
