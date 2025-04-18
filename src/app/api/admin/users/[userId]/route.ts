// File: src/app/api/admin/users/[userId]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User, { UserRole } from "@/models/User";

export async function PATCH(
  request: Request,
  // Declare params as a Promise to match Next.js 15's ParamCheck<RouteContext>
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  try {
    // Wait for the params promise to resolve
    const { userId } = await params;

    // Connect to your database
    await dbConnect();

    // Parse and validate the incoming role
    const { role } = (await request.json()) as { role: UserRole };
    const validRoles: UserRole[] = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Find and update the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    user.role = role;
    await user.save();

    // Return the updated user
    return NextResponse.json(
      { message: "User role updated successfully", user },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating user role:", err);
    return NextResponse.json(
      { error: "Error updating user role" },
      { status: 500 }
    );
  }
}
