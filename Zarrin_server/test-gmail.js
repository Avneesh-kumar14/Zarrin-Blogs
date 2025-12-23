// ================================================
// TEST GMAIL EMAIL CONFIGURATION
// ================================================

require('dotenv').config();
const nodemailer = require('nodemailer');

const testGmailConnection = async () => {
  try {
    console.log('🔍 Testing Gmail SMTP Configuration...\n');
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail connection verified successfully!');
    console.log(`📧 Sender Email: ${process.env.GMAIL_EMAIL}`);
    console.log(`🔐 App Password: ${process.env.GMAIL_APP_PASSWORD.slice(0, 4)}${'*'.repeat(process.env.GMAIL_APP_PASSWORD.length - 4)}\n`);

    // Send test email
    console.log('📨 Sending test OTP email...\n');
    const testOtp = '123456';
    
    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: process.env.GMAIL_EMAIL, // Send to yourself
      subject: '✅ Test - Zarrin Blogs OTP Verification',
      html: `
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h1>✅ Gmail Setup Test Successful!</h1>
          </div>
          <div style="padding: 20px;">
            <p>This is a test email to verify your Gmail OTP system is working.</p>
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; color: #666;">Your verification code:</p>
              <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${testOtp}</div>
            </div>
            <p><strong>Gmail SMTP Configuration Details:</strong></p>
            <ul>
              <li>Email: ${process.env.GMAIL_EMAIL}</li>
              <li>Service: Gmail SMTP</li>
              <li>Status: ✅ Connected</li>
            </ul>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}\n`);
    
    console.log('═══════════════════════════════════════════════');
    console.log('✅ Gmail OTP SYSTEM IS READY TO USE!');
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Make sure GMAIL_EMAIL is set in .env');
    console.log('2. Make sure GMAIL_APP_PASSWORD is set in .env');
    console.log('3. Verify the app password is correct (spaces matter!)');
    console.log('4. Enable "Less secure app access" or use App Password from Gmail');
    process.exit(1);
  }
};

testGmailConnection();
