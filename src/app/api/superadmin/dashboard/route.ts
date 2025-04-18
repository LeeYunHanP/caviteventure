// File: src/app/api/superadmin/dashboard/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";
import User from "@/models/User";
import Event from "@/models/Event";
import Log from "@/models/Log";

export async function GET(): Promise<NextResponse> {
  // Connect to the database
  await dbConnect();

  // Retrieve the cookie store and get the session token
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value || null;

  // If no session token is found, return a 401 response
  if (!sessionToken) {
    return new NextResponse(
      JSON.stringify({ error: "No session token, not logged in" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Convert session token into a userId
  const userId = await getUserIdByToken(sessionToken);
  if (!userId) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid session token" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Fetch the user from the database
  const user = await User.findById(userId).lean();
  if (!user) {
    return new NextResponse(
      JSON.stringify({ error: "User not found" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Check if the user has a superadmin role
  if (user.role !== "superadmin") {
    return new NextResponse(
      JSON.stringify({ error: "Not authorized" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Gather dashboard data
  const totalUsers = await User.countDocuments({});
  const totalMale = await User.countDocuments({ gender: "male" });
  const totalFemale = await User.countDocuments({ gender: "female" });
  const approvedEvents = await Event.find({ status: "approved" }).lean();
  const logs = await Log.find({
    action: { $in: ["create event", "approve event"] },
  })
    .populate("userId", "name email")
    .lean();
  const allUsers = await User.find({}).lean();
  const admins = await User.find({ role: "admin" }).lean();

  // Return the gathered data as JSON
  return NextResponse.json({
    totalUsers,
    totalMale,
    totalFemale,
    approvedEvents,
    logs,
    allUsers,
    admins,
  });
}
