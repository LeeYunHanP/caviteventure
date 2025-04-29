// File: src/app/api/events/[id]/approve/route.ts

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    // 1) Connect to your MongoDB
    await dbConnect();

    // 2) Validate the event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

    // 3) Pull the admin’s ID from the request body and validate
    const { adminId } = await request.json();
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return NextResponse.json(
        { error: "Invalid admin ID" },
        { status: 400 }
      );
    }

    // 4) Approve the event and set approvedBy
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        status: "approved",
        approvedBy: new mongoose.Types.ObjectId(adminId),
      },
      { new: true }
    )
      .populate({ path: "createdBy", select: "name" })
      .populate({ path: "approvedBy", select: "name" })
      .lean();

    // 5) Handle “not found”
    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // 6) Return the full, populated event object
    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (err: unknown) {
    console.error("Error approving event:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
