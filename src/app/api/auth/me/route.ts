export const runtime  = "nodejs";
export const dynamic  = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { parseCookies } from "@/lib/cookieUtils";
import { getUserIdByToken } from "@/lib/auth";
import User from "@/models/User";

/** Simple RBAC map (expand as needed) */
const PERMISSIONS: Record<string, string[]> = {
  superadmin: ["read:any", "write:any", "delete:any"],
  admin:      ["read:any", "write:own"],
  user:       ["read:own"],
};

export async function GET(req: NextRequest) {
  // 1) Connect once and reuse
  try {
    await dbConnect();
  } catch {
    return NextResponse.json(
      { isAuthenticated: false, error: "DB connection failed" },
      { status: 500 },
    );
  }

  // 2) Parse cookies
  const cookies      = parseCookies(req.headers.get("cookie") ?? "");
  const sessionToken = cookies.sessionToken;
  if (!sessionToken) return NextResponse.json({ isAuthenticated: false });

  // 3) Validate & fetch user
  try {
    const userId = await getUserIdByToken(sessionToken);
    if (!userId) return NextResponse.json({ isAuthenticated: false });

    const user = await User.findById(userId)
      .select("-password -__v")  // never leak sensitive fields
      .lean();

    if (!user) return NextResponse.json({ isAuthenticated: false });

    // 4) Optional query string controls
    const params           = req.nextUrl.searchParams;
    const includePerms     = params.get("includePerms") === "true";
    const includeProfileOk = params.get("includeProfileOk") === "true";

    const payload: Record<string, unknown> = {
      _id:  user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (includePerms) {
      payload.permissions = PERMISSIONS[user.role] ?? [];
    }
    if (includeProfileOk) {
      payload.profileComplete = Boolean(user.name && user.email);
    }

    return NextResponse.json({ isAuthenticated: true, user: payload });
  } catch (err) {
    console.error("Session check error:", err);
    return NextResponse.json(
      { isAuthenticated: false, error: "Session check failed" },
      { status: 500 },
    );
  }
}
