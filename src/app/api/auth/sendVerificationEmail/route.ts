export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Utility to send a verification code for password reset
async function sendVerificationEmail(toEmail: string, code: string) {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  // Verify connection
  await transporter.verify();
  console.log("SMTP transporter verified successfully.");

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <div style="background: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 5px;">
            <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
            <p>Hello,</p>
            <p>You requested to reset your password. Please use the following 6-digit verification code to proceed:</p>
            <p style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">${code}</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <hr style="margin: 20px 0;" />
            <p style="font-size: 12px; color: #555;">This is an automated message from Cavite Venture Museum. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"Cavite Venture Museum" <${process.env.MAIL_FROM!}>`,
    to: toEmail,
    subject: "Reset Your Password Verification Code",
    text: `Your password reset verification code is: ${code}`,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ message: "A valid email address is required." }, { status: 400 });
    }

    // Generate code and send email
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await sendVerificationEmail(email.trim().toLowerCase(), code);

    // TODO: store code in DB or cache for later verification

    return NextResponse.json({ message: "Verification code sent successfully!" }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error sending verification code:", err.message, err.stack);
    } else {
      console.error("Unknown error sending verification code:", err);
    }
    return NextResponse.json({ message: "Error sending code." }, { status: 500 });
  }
}
