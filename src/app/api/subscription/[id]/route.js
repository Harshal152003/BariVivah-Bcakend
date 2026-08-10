import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";

// Get a subscription by ID
export async function GET(_, { params }) {
  const { id } = await params;
  

  try {
    await connectDB();
    const plan = await Subscription.findById(id);
    if (!plan) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(plan);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Update a subscription
export async function PUT(req, { params }) {
  const { id } = await params;
  await connectDB();
  const updates = await req.json();

  try {
    const updated = await Subscription.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// Delete a subscription
export async function DELETE(_, { params }) {
  const { id } = await params;
  await connectDB();

  try {
    await Subscription.findByIdAndDelete(id);
    return NextResponse.json({ message: "Subscription deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
