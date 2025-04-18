// app/api/auth/verify-code/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    // Simple validation so `email` and `code` are referenced
    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and code are required" },
        { status: 400 }
      );
    }

    // TODO: replace this with your real verification logic
    console.log(`Verifying code ${code} for ${email}`);

    return NextResponse.json({ message: "Code verified successfully" });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Error verifying code" }),
      { status: 500 }
    );
  }
}
