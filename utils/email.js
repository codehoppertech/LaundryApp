const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

/**
 * Send email using configured transport
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: config.email.from,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Generate verification email HTML
 */
const generateVerificationEmail = (code) => {
  return `
    <h1>Email Verification</h1>
    <p>Thank you for registering. Please use the following code to verify your email:</p>
    <h2 style="color: #2196F3;">${code}</h2>
    <p>This code will expire in 30 minutes.</p>
  `;
};

/**
 * Generate password reset email HTML
 */
const generatePasswordResetEmail = (code) => {
  return `
    <h1>Password Reset Request</h1>
    <p>You have requested to reset your password. Please use the following code:</p>
    <h2 style="color: #2196F3;">${code}</h2>
    <p>This code will expire in 30 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;
};

module.exports = {
  sendEmail,
  generateVerificationEmail,
  generatePasswordResetEmail
};