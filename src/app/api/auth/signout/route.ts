// File: app/api/auth/signout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseCookies, serializeSessionCookie } from "@/lib/cookieUtils";
import { destroySession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = parseCookies(cookieHeader);
    const token = cookies["sessionToken"];

    if (token) {
      // remove from DB
      await destroySession(token);
    }

    // overwrite cookie
    const emptyCookie = serializeSessionCookie("");
    const response = NextResponse.json({ message: "Signed out." });
    response.headers.set("Set-Cookie", emptyCookie);
    return response;
  } catch (err) {
    console.error("Sign out error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
