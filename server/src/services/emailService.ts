/**
 * Email Service
 * Sends transactional emails
 */

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  try {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
            .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 8px; }
            .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to VocalLab AI! 🎵</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for signing up for VocalLab AI! We're excited to have you on board.</p>
              <p>With VocalLab AI, you can:</p>
              <ul>
                <li>Upload and process your vocal audio</li>
                <li>Use AI-powered preset optimization</li>
                <li>Create and share custom presets</li>
                <li>Download professional-quality processed audio</li>
              </ul>
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Start Processing</a>
              <p>If you have any questions, don't hesitate to contact our support team.</p>
              <p>Best regards,<br>The VocalLab AI Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@vocallab.ai',
      to: email,
      subject: 'Welcome to VocalLab AI!',
      html: htmlContent,
    });

    console.log(`[INFO] Welcome email sent to ${email}`);
  } catch (error) {
    console.error('[ERROR] Failed to send welcome email:', error);
  }
};

/**
 * Send processing complete email
 */
export const sendProcessingCompleteEmail = async (
  email: string,
  jobId: string,
  fileName: string
): Promise<void> => {
  try {
    const downloadUrl = `${process.env.FRONTEND_URL}/download/${jobId}`;

    const htmlContent = `
      <html>
        <body>
          <h2>Your Audio is Ready!</h2>
          <p>Your vocal processing is complete.</p>
          <p><strong>File:</strong> ${fileName}</p>
          <a href="${downloadUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">Download Now</a>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@vocallab.ai',
      to: email,
      subject: 'Your Audio Processing is Complete',
      html: htmlContent,
    });
  } catch (error) {
    console.error('[ERROR] Failed to send processing email:', error);
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const htmlContent = `
      <html>
        <body>
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password.</p>
          <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">Reset Password</a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@vocallab.ai',
      to: email,
      subject: 'Password Reset Request',
      html: htmlContent,
    });
  } catch (error) {
    console.error('[ERROR] Failed to send reset email:', error);
  }
};

export default transporter;
