import { NextResponse } from "next/server";

export async function DELETE(request) {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}