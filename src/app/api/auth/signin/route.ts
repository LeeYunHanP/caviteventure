// File: app/api/auth/signin/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { createSession } from "@/lib/auth"; // Creates a session in the DB
import { serializeSessionCookie } from "@/lib/cookieUtils";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // 1) Connect to DB
    await dbConnect();

    // 2) Look up user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 3) Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword || "");
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 4) Create a session document in the DB
    const token = await createSession(user._id.toString());

    // 5) Serialize the token into an HttpOnly cookie
    const cookie = serializeSessionCookie(token);

    // 6) Return success + user role in JSON
    const response = NextResponse.json({
      message: "Sign in successful.",
      role: user.role, // e.g. "user", "admin", or "superadmin"
    });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
