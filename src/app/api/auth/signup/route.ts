export const runtime = "nodejs"; // needed if you use Node modules in Edge by default

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      city,
      gender,
      password,
      confirmPassword,
      acceptTerms,
      captchaToken,
    } = await req.json();

    // Verify CAPTCHA
    if (!captchaToken) {
      return NextResponse.json({ message: "Missing CAPTCHA token." }, { status: 400 });
    }
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error('Missing RECAPTCHA_SECRET_KEY in environment');
      return NextResponse.json({ message: "Server misconfiguration." }, { status: 500 });
    }
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
    const captchaRes = await fetch(verifyUrl, { method: 'POST' });
    const captchaJson = await captchaRes.json();
    if (!captchaJson.success) {
      console.error('reCAPTCHA verification failed:', captchaJson['error-codes']);
      return NextResponse.json({ message: "CAPTCHA verification failed." }, { status: 400 });
    }

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

    // Connect to DB
    await dbConnect();

    // Check duplicates
    if (await User.findOne({ name })) {
      return NextResponse.json({ message: "A user with that name already exists." }, { status: 400 });
    }
    if (await User.findOne({ email })) {
      return NextResponse.json({ message: "A user with that email already exists." }, { status: 400 });
    }

    // Hash password & create verify code
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    await User.create({
      name,
      email,
      city,
      gender,
      hashedPassword,
      isVerified: false,
      verifyCode,
    });

    // Send email
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
