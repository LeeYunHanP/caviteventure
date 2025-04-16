import nodemailer from "nodemailer";

export async function sendVerificationEmail(toEmail: string, code: string) {
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

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
          <div style="background: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 5px;">
              <h2 style="text-align: center; color: #333;">Cavite Venture Museum Email Verification</h2>
              <p>Hello!</p>
              <p>Thank you for signing up. To verify your email, please use the following 6-digit code:</p>
              <p style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">${code}</p>
              <p>Enter this code on our website to complete your registration.</p>
              <p>If you did not request this, you can safely ignore this email.</p>
              <hr style="margin: 20px 0;" />
              <p style="font-size: 12px; color: #555;">This is an automated message from Cavite Venture Museum.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      // Use the SMTP_USER as the sender address to ensure deliverability
      from: `"Cavite Venture Museum" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Verify your email address",
      text: `Your verification code is ${code}`, // Fallback text version
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}
