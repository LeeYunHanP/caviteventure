// File: app/api/admin/events/[id]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";
import User from "@/models/User";
import Event from "@/models/Event";
import Log from "@/models/Log";

/**
 * DELETE /api/admin/events/[id]
 */
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    // 1) Check session token
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/sessionToken=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token) {
      return NextResponse.json({ error: "No session token" }, { status: 401 });
    }

    // 2) Verify user is admin
    const userId = await getUserIdByToken(token);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const currentUser = await User.findById(userId).lean();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 3) Extract the [id] from request.nextUrl.pathname
    //    e.g. /api/admin/events/123 => ["","api","admin","events","123"]
    const segments = req.nextUrl.pathname.split("/");
    const eventId = segments.pop(); // "123"

    if (!eventId) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    // 4) Delete the event
    const eventToDelete = await Event.findByIdAndDelete(eventId);
    if (!eventToDelete) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 5) Log the deletion
    await Log.create({
      userId: currentUser._id,
      actionType: "deleted event",
      eventId,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/events/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/events/[id]
 */
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // 1) Check session token
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/sessionToken=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token) {
      return NextResponse.json({ error: "No session token" }, { status: 401 });
    }

    // 2) Verify user is admin
    const userId = await getUserIdByToken(token);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const currentUser = await User.findById(userId).lean();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 3) Extract the [id] from request.nextUrl.pathname
    const segments = req.nextUrl.pathname.split("/");
    const eventId = segments.pop(); // e.g. "123"

    if (!eventId) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    // 4) Parse updated fields
    const { title, description, date, location, image } = await req.json();

    // 5) Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { title, description, date, location, image },
      { new: true } // returns the updated doc
    );
    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 6) Log the update
    await Log.create({
      userId: currentUser._id,
      actionType: "updated event",
      eventId,
    });

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (err) {
    console.error("PUT /api/admin/events/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
