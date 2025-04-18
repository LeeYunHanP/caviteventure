import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Adjust the path as needed
import User from "@/models/User"; // Adjust the path as needed
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and new password are required." },
        { status: 400 }
      );
    }

    // Hash the new password with bcrypt using 10 salt rounds (consistent with sign-up)
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's hashedPassword in the database based on the provided email
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { message: "Error resetting password." },
      { status: 500 }
    );
  }
}
