// File: src/app/api/events/[eventId]/approve/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import mongoose from "mongoose";

export async function PATCH(
  _request: Request,
  // Declare params as a Promise for Next.js 15
  { params }: { params: Promise<{ eventId: string }> }
): Promise<NextResponse> {
  try {
    // Await the dynamic segment
    const { eventId } = await params;

    // Connect to the database
    await dbConnect();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

    // Update event status
    const updated = await Event.findByIdAndUpdate(
      eventId,
      { status: "approved" },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event approved successfully" },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error approving event:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
