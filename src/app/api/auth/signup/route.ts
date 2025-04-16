export const runtime = "nodejs"; // needed if you use Node modules in Edge by default

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, city, gender, password, confirmPassword, acceptTerms } = await req.json();

    // Basic validations
    if (!name || !email || !city || !gender || !password || !confirmPassword) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
    if (!acceptTerms) {
      return NextResponse.json({ message: "You must accept the Terms and Conditions." }, { status: 400 });
    }
    if (password.length !== 8) {
      return NextResponse.json({ message: "Password must be exactly 8 characters long." }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match." }, { status: 400 });
    }

    await dbConnect();

    // Check if a user with the same name or email already exists
    const existingName = await User.findOne({ name });
    if (existingName) {
      return NextResponse.json({ message: "A user with that name already exists." }, { status: 400 });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ message: "A user with that email already exists." }, { status: 400 });
    }

    // Hash password and generate a 6-digit verification code
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create the user document
    await User.create({
      name,
      email,
      city,
      gender,
      hashedPassword,
      isVerified: false,
      verifyCode,
    });

    // Send verification email using nodemailer
    await sendVerificationEmail(email, verifyCode);

    return NextResponse.json(
      { message: "User created successfully! Check your email for the verification code." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
