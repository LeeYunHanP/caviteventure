// File: src/app/api/events/[eventId]/approve/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import mongoose from "mongoose";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: { eventId: string } }
): Promise<NextResponse> {
  try {
    await dbConnect();

    const { eventId } = params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

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
