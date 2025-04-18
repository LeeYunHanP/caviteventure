// File: src/app/api/superadmin/eventapproval/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getUserIdByToken } from "@/lib/auth";
import Event from "@/models/Event";

export async function GET(): Promise<NextResponse> {
  // 1) Connect to DB
  await dbConnect();

  // 2) Grab cookies
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value || null;

  // 3) Check if sessionToken exists
  if (!sessionToken) {
    return new NextResponse(
      JSON.stringify({ error: "No session token, not logged in" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 4) Convert sessionToken -> userId
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

  // 5) (Your approval‐listing logic here…)
  const pendingToApprove = await Event.find({ status: "pending" }).lean();

  return NextResponse.json({ pendingToApprove });
}
