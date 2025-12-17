// ================================================
// EMAIL SERVICE - Send OTP via Email
// ================================================

const { Resend } = require('resend');

// ✅ Configure Resend Email Service
const resend = new Resend(process.env.RESEND_API_KEY || 're_test_key');

// ✅ Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ Send OTP Email
const sendOTPEmail = async (email, otp) => {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: '🔐 Zarrin Blogs - Email Verification OTP',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
              .content { padding: 20px; }
              .otp-box { background-color: #f0f0f0; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
              .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
              .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
              .warning { color: #d32f2f; font-size: 14px; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📧 Email Verification</h1>
              </div>
              
              <div class="content">
                <p>Hello,</p>
                
                <p>Thank you for signing up with Zarrin Blogs! To complete your registration, please verify your email address using the OTP (One-Time Password) below:</p>
                
                <div class="otp-box">
                  <p style="margin: 0; color: #666; margin-bottom: 10px;">Your verification code:</p>
                  <div class="otp-code">${otp}</div>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                  <strong>This OTP will expire in 10 minutes.</strong>
                </p>
                
                <div class="warning">
                  ⚠️ If you did not sign up for this account, please ignore this email.
                </div>
                
                <p style="margin-top: 20px;">
                  <strong>Did you know?</strong> This OTP ensures your account remains secure and only you can access it.
                </p>
              </div>
              
              <div class="footer">
                <p>© 2024 Zarrin Blogs. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (response.error) {
      console.error('Resend OTP error:', response.error);
      return { success: false, message: 'Failed to send OTP', error: response.error.message };
    }

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, message: 'Failed to send OTP', error: error.message };
  }
};

// ✅ Send Welcome Email (after verification)
const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: '🎉 Welcome to Zarrin Blogs!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
              .content { padding: 20px; }
              .button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to Zarrin Blogs!</h1>
              </div>
              
              <div class="content">
                <p>Hi ${name},</p>
                
                <p>Your email has been verified successfully! Your account is now fully activated.</p>
                
                <p>You can now:</p>
                <ul>
                  <li>✍️ Create and publish blogs</li>
                  <li>📖 Read blogs from other writers</li>
                  <li>💬 Comment and engage with the community</li>
                  <li>❤️ Like and bookmark your favorite blogs</li>
                  <li>👥 Follow other writers</li>
                </ul>
                
                <p>
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Start Writing Now</a>
                </p>
                
                <p>If you have any questions or need help, feel free to contact us.</p>
                
                <p>Happy blogging!</p>
              </div>
              
              <div class="footer">
                <p>© 2024 Zarrin Blogs. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (response.error) {
      console.error('Resend welcome email error:', response.error);
      return { success: false, message: 'Failed to send welcome email', error: response.error.message };
    }

    return { success: true, message: 'Welcome email sent' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: 'Failed to send welcome email', error: error.message };
  }
};

// ✅ Send Password Reset Email
const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: '🔑 Zarrin Blogs - Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
              .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
              .content { padding: 20px; }
              .button { display: inline-block; background-color: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
              .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 5px; margin: 15px 0; color: #856404; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔑 Password Reset</h1>
              </div>
              
              <div class="content">
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                
                <a href="${resetLink}" class="button">Reset Password</a>
                
                <p style="color: #666; font-size: 14px;">
                  <strong>This link will expire in 1 hour.</strong>
                </p>
                
                <div class="warning">
                  ⚠️ If you didn't request this, please ignore this email. Your password will remain unchanged.
                </div>
              </div>
              
              <div class="footer">
                <p>© 2024 Zarrin Blogs. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (response.error) {
      console.error('Resend password reset error:', response.error);
      return { success: false, message: 'Failed to send password reset email', error: response.error.message };
    }

    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, message: 'Failed to send password reset email', error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
