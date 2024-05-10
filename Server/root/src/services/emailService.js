//services/emailService.js
require('dotenv').config({ path: '../../.env' });
const sgMail = require('@sendgrid/mail');

/**
 * Sends an email.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text content of the email.
 * @param {string} html - The html content of the email.
 */
async function sendEmail(to, subject, text,html=`<strong>${text}</strong>`) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: to, // Change to your recipient
        from: 'freezer.spa@gmail.com', // Change to your verified sender
        subject: subject,
        text: text,
        html: html,
        }
    
    try {
        await sgMail.send(msg);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}



/**
 * Sends confermation email.
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} confirmationLink - The confermation link.
 */

async function sendConfirmationEmail(recipientEmail, confirmationLink) {
  // Set SendGrid API Key securely using environment variable

  const SENDGRID_API_KEY=process.env.SENDGRID_API_KEY;

  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: recipientEmail,
    from: 'freezer.spa@gmail.com', // Change to your verified sender
    subject: 'Verify your email address for UniDomus',
    text: `Hi there!

    Thank you for signing up with UniDomus. To verify your email address and activate your account, please click on the following link:

    ${confirmationLink}

    This link will expire within 24 hours.

    Sincerely,
    The UniDomus Team`,
    html: `
    <strong>Hi there!</strong><br>

    <p>Thank you for signing up with UniDomus. To verify your email address and activate your account, please click on the following link:</p>

    <a href="${confirmationLink}">${confirmationLink}</a>

    <p>This link will expire within 24 hours.</p>

    <p>Sincerely,</p>
    <p>The UniDomus Team</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

/**
 * Sends a password reset email.
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} resetLink - The password reset link.
 */

async function sendPasswordResetEmail(recipientEmail, resetLink) {
  // Set SendGrid API Key securely using environment variable
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
    to: recipientEmail,
    from: 'freezer.spa@gmail.com', // Change to your verified sender
    subject: 'Password Reset Request for UniDomus',
    text: `Hi there!

    We received a request to reset your password for your UniDomus account. If you didn't make this request, you can ignore this email.

    To reset your password, please click on the following link:

    ${resetLink}

    This link will expire within 24 hours.

    Sincerely,
    The UniDomus Team`,
    html: `
    <strong>Hi there!</strong><br>

    <p>We received a request to reset your password for your UniDomus account. If you didn't make this request, you can ignore this email.</p>

    <p>To reset your password, please click on the following link:</p>

    <a href="${resetLink}">${resetLink}</a>

    <p>This link will expire within 24 hours.</p>

    <p>Sincerely,</p>
    <p>The UniDomus Team</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('Password reset email sent successfully!');
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
}


module.exports={
  sendEmail,
  sendConfirmationEmail,
  sendPasswordResetEmail
};

