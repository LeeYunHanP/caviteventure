import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function sendVerificationEmail(toEmail: string, code: string) {
  try {
    // Create a transporter using your SMTP settings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === "465", // true for port 465, false for others
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify the connection configuration
    await transporter.verify();
    console.log("SMTP transporter verified successfully.");

    // Updated email content for forgot password flow
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
              <p style="font-size: 12px; color: #555;">
                This is an automated message from Cavite Venture Museum. Please do not reply.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"Cavite Venture Museum" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Reset Your Password Verification Code",
      text: `Your password reset verification code is: ${code}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body to get the email address
    const { email } = await req.json();

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Send the verification email with the updated content for forgot password
    await sendVerificationEmail(email, code);

    // Optionally, store the code in your database or cache to verify later

    return NextResponse.json({
      message: "Verification code sent successfully!",
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Error sending code." }),
      { status: 500 }
    );
  }
}
