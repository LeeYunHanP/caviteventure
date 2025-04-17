export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getUserIdByToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await dbConnect();

  let body: {
    name?: string;
    city?: string;
    gender?: string;
    profilePicture?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const { name, city, gender, profilePicture } = body;

  // Authenticate
  const token = req.cookies.get("sessionToken")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const userId = await getUserIdByToken(token);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Validate
  if (!name || !city || !gender) {
    return NextResponse.json(
      { message: "Name, city, and gender are required." },
      { status: 400 }
    );
  }

  // Update only those fields
  try {
    const updated = await User.findByIdAndUpdate(
      userId,
      { name, city, gender, profilePicture },
      { new: true }
    ).lean();
    if (!updated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // Return the full updated document (including profilePicture)
    return NextResponse.json({ message: "Profile updated", user: updated });
  } catch (e) {
    console.error("Update error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
