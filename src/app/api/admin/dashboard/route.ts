
// File: app/api/admin/dashboard/route.ts

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
// Example placeholders; swap for your real models
import User from "@/models/User";
import Event from "@/models/Event";
import Log from "@/models/Log";
import Comment from "@/models/Comment";

// Helper for verifying admin from session token
import { getUserIdByToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
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

    // 5) If admin, gather all needed data

    // -- Count total users, total male, total female
    const totalUsers = await User.countDocuments({});
    const totalMale = await User.countDocuments({ gender: "male" });
    const totalFemale = await User.countDocuments({ gender: "female" });

    // -- Logs (who created, edited, deleted events)
    //    Let's assume each Log doc has: 
    //    { userId, actionType, eventId, timestamp } 
    //    Then we can populate the user’s name, email, location, etc.
    const logs = await Log.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "name email location")
      .lean();

    // -- All posted events
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();

    // -- Comments on events (assuming a separate Comment model)
    //    Each comment might reference a userId, eventId, plus text
    //    We'll just fetch them all for the example
    const comments = await Comment.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("eventId", "title")
      .lean();

    // -- All users
    const allUsers = await User.find({}).select("name email gender location role").lean();

    // -- All admins
    const admins = await User.find({ role: "admin" }).select("name email gender location role").lean();

    // 6) Return the combined data
    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalMale,
        totalFemale,
        logs,
        events,
        comments,
        allUsers,
        admins,
      },
    });
  } catch (err) {
    console.error("Error in GET /api/admin/dashboard:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
