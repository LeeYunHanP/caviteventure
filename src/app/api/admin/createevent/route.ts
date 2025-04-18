// File: app/api/admin/createevent/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";

import User from "@/models/User";
import Event from "@/models/Event";
import Log from "@/models/Log";

export async function POST(req: NextRequest) {
  try {
    // 1) Connect to DB
    await dbConnect();

    // 2) Parse session token from cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/sessionToken=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 3) Validate token -> get userId
    const userId = await getUserIdByToken(token);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 4) Fetch user from DB to check role
    const currentUser = await User.findById(userId).lean();
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 5) Parse the request body (JSON with base64 image)
    const body = await req.json();
    const { title, description, date, location, image } = body;

    if (!title || !description || !date || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 6) Create the event with status = "pending"
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      createdBy: currentUser._id,
      image, // store the base64 or data URL
      status: "pending", // Key line: event now requires superadmin approval
    });

    // 7) Create a log entry
    await Log.create({
      userId: currentUser._id,
      actionType: "created event",
      eventId: newEvent._id,
    });

    // 8) Respond success
    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (err) {
    console.error("Error in POST /api/admin/createevent:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
