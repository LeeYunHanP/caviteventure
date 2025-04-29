import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";
import Event from "@/models/Event";
import mongoose from "mongoose";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
): Promise<NextResponse> {
  try {
    // 1) Resolve the dynamic route param
    const { eventId } = await params;

    // 2) Connect to your database
    await dbConnect();

    // 3) Validate the incoming ID
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

    // 4) Authenticate user via sessionToken
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    const userId = await getUserIdByToken(sessionToken);
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid session token" },
        { status: 401 }
      );
    }

    // 5) Approve the event and set approvedBy
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { status: "approved", approvedBy: new mongoose.Types.ObjectId(userId) },
      { new: true }
    ).lean();

    // 6) If nothing was found, return 404
    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // 7) Return the updated record (including its database _id & approvedBy)
    return NextResponse.json(
      {
        message: "Event approved successfully",
        event: updatedEvent
      },
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