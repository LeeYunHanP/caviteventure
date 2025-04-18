// File: src/app/api/admin/users/[userId]/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User, { UserRole } from "@/models/User";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    await dbConnect();

    const { userId } = params;
    // parse and type the body as UserRole
    const { role } = (await request.json()) as { role: UserRole };

    // optional: validate against your allowed roles
    const validRoles: UserRole[] = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    user.role = role;
    await user.save();

    return NextResponse.json(
      {
        message: "User role updated successfully",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Error updating user role" },
      { status: 500 }
    );
  }
}
