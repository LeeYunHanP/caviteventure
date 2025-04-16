// File: app/api/auth/updateProfile/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getUserIdByToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, city, gender, profilePicture } = await req.json();

    // Extract session token from cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/sessionToken=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = await getUserIdByToken(token);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, city, gender, profilePicture },
      { new: true }
    ).lean();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
