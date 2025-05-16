import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Log email user for verification (avoid logging password)
console.log(`Email configuration: ${process.env.EMAIL_USER}`);

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the SMTP transporter
transporter.verify((error) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Generate a random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email function
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration missing. Check EMAIL_USER and EMAIL_PASS environment variables.');
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your CodeNest OTP is here!',
      text: `Thank you for registering with CodeNest!

Please use the following OTP to verify your email address:

${otp}

This OTP is valid for 10 minutes. If you didn't request this verification, you can safely ignore this email.`,

      html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 12px; background: #0f0f0f; color: #eaeaea; border: 1px solid #2e2e2e; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);">
    
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 32px; color: #4a6cf7; margin-bottom: 5px;">CodeNest</h1>
      <p style="font-size: 15px; color: #ccc;">Secure your account and start building!</p>
    </div>

    <div style="background-color: #1a1a1a; padding: 25px; border-radius: 10px; border-left: 5px solid #4a6cf7;">
      <h2 style="font-size: 22px; color: #ffffff; margin-top: 0;">Your Verification Code</h2>
      <p style="font-size: 15px; color: #bfbfbf;">Thanks for joining CodeNest! Enter the OTP below to verify your email and unlock access to real-time code collaboration, projects, and more.</p>

      <div style="margin: 30px 0; text-align: center;">
        <div style="display: inline-block; background: #4a6cf7; color: #fff; padding: 16px 32px; font-size: 36px; font-weight: bold; border-radius: 12px; letter-spacing: 12px; box-shadow: 0 4px 15px rgba(74, 108, 247, 0.5);">
          ${otp}
        </div>
      </div>

      <p style="font-size: 13px; color: #888;">This code is valid for <strong>10 minutes</strong>. If you didn’t request this, you can safely ignore this email.</p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <p style="font-size: 14px; color: #999;">Start coding smarter, faster, together — only on <strong>CodeNest</strong>.</p>
      <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} CodeNest. All rights reserved.</p>
    </div>
  </div>
`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
