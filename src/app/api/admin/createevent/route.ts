// File: src/app/api/admin/createevent/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
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

    // 5) Parse the request body
    const { title, description, date, time, location, image } = await req.json();

    // 6) Validate required fields
    if (!title || !description || !date || !time || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 7) Combine date and time
    const dateTime = new Date(`${date}T${time}`);
    if (isNaN(dateTime.getTime())) {
      return NextResponse.json({ error: "Invalid date or time format" }, { status: 400 });
    }

    // 8) Create the event (status pending)
    const newEventDoc = await Event.create({
      title,
      description,
      date: dateTime,
      time,
      location,
      image,
      createdBy: new mongoose.Types.ObjectId(currentUser._id),
      approvedBy: null,
      status: "pending",
    });

    // 9) Log the creation
    await Log.create({
      userId: new mongoose.Types.ObjectId(currentUser._id),
      actionType: "created event",
      eventId: newEventDoc._id,
      description: `Created event '${title}' scheduled at ${date} ${time}`,
    });

    // 10) Populate createdBy & approvedBy for response
    const populatedEvent = await Event.findById(newEventDoc._id)
      .populate({ path: "createdBy", select: "name" })
      .populate({ path: "approvedBy", select: "name" })
      .lean();

    // 11) Return success with populated event
    return NextResponse.json(
      { success: true, event: populatedEvent },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Error in POST /api/admin/createevent:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}