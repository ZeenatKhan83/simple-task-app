const nodemailer = require('nodemailer');

// Generic SMTP transporter — works with Gmail (with an App Password),
// Mailtrap (safe for local testing), or any other SMTP provider.
// Configure these via environment variables in server/.env (see .env.example).
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587/others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"Momentum" <${from}>`,
    to: toEmail,
    subject: 'Your Momentum password reset code',
    text: `Your password reset code is ${otp}. It expires in 10 minutes. If you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6366F1;">Reset your password</h2>
        <p>Use the code below to reset your Momentum account password. This code expires in <strong>10 minutes</strong>.</p>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; background: #F1F5F9; padding: 16px 24px; border-radius: 8px; text-align: center; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #64748B; font-size: 13px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };
