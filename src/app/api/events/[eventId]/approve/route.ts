// File: src/app/api/events/[eventId]/approve/route.ts

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export async function PATCH(
  request: Request,
  // params is a Promise in the App Router
  { params }: { params: Promise<{ eventId: string }> }
): Promise<NextResponse> {
  try {
    // await the params promise to get your dynamic ID
    const { eventId } = await params;

    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const { adminId } = await request.json();
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { status: "approved", approvedBy: adminId },
      { new: true }
    )
      .populate({ path: "createdBy", select: "name" })
      .populate({ path: "approvedBy", select: "name" })
      .lean();

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (err: unknown) {
    console.error("Error approving event:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
