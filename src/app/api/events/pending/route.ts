// File: src/app/api/events/pending/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";

export async function GET(): Promise<NextResponse> {
  try {
    await dbConnect();
    const pendingEvents = await Event.find({ status: "pending" }).lean();
    return NextResponse.json({ events: pendingEvents });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
