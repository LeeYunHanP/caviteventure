// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export async function GET() {
  await dbConnect();

  const events = await Event
    .find({ status: "approved" })
    .populate({ path: "createdBy", select: "name" })
    .populate({ path: "approvedBy", select: "name" })
    .lean();

  return NextResponse.json(events);
}
