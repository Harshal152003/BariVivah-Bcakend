import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Interest from "@/models/Interest";
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
    return NextResponse.json({ message: "Invalid input" }, { status: 400,headers:corsHeaders });
  }

  const interest = await Interest.findById(interestId);
  if (!interest) {
    return NextResponse.json({ message: "Interest not found" }, { status: 404 ,headers:corsHeaders});
  }

  interest.status = status;
  await interest.save();

  return NextResponse.json({ message: "Status updated", interest },{headers:corsHeaders});
}
// This route updates the status of an interest (accepted or declined).