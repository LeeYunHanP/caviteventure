import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ message: "Email and code are required." }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    if (user.isVerified) {
      return NextResponse.json({ message: "User is already verified." }, { status: 400 });
    }
    if (user.verifyCode !== code) {
      return NextResponse.json({ message: "Invalid verification code." }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyCode = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully. You can now sign in." });
  } catch (err) {
    console.error("Verify code error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
