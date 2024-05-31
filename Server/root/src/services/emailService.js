//services/emailService.js
require('dotenv').config({ path: '../../.env' });
const sgMail = require('@sendgrid/mail');
const { convertSecondsToDHMS } = require('../utils/dateUtils');

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

/**
 * Sends an email confirming user deletion.
 * @param {string} recipientEmail - The recipient's email address.
 */
async function sendUserDeletedEmail(recipientEmail) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FRONTEND_BASE = process.env.FRONTEND_BASE;

  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
      to: recipientEmail,
      from: 'freezer.spa@gmail.com', // Change to your verified sender
      subject: 'UniDomus Account Deletion Notification',
      text: `Dear User,

      We regret to inform you that your UniDomus account has been deleted due to non-compliance with our website's guidelines.

      If you believe this was a mistake or have any questions, please contact our support team.

      You can visit our website here: ${FRONTEND_BASE}

      Sincerely,
      The UniDomus Team`,
      html: `
      <p>Dear User,</p>
      
      <p>We regret to inform you that your UniDomus account has been deleted due to non-compliance with our website's guidelines.</p>
      
      <p>If you believe this was a mistake or have any questions, please contact our support team.</p>
      
      <p>You can visit our website here: <a href="${FRONTEND_BASE}">UniDomus</a></p>
      
      <p>Sincerely,</p>
      <p>The UniDomus Team</p>
      `,
  };

  try {
      await sgMail.send(msg);
      console.log('User deleted email sent successfully!');
  } catch (error) {
      console.error('Error sending user deleted email:', error);
  }
}


/**
* Sends an email to a banned user informing them of the ban duration or if it is permanent.
* @param {string} recipientEmail - The recipient's email address.
* @param {number} banTimeInSeconds - The duration of the ban in seconds.
* @param {boolean} banPermanently - Whether the ban is permanent.
* @param {number} prevBanNum - The number of times the user has been banned previously.
* @param {string} banMsg - The message explaining the reason for the ban.
*/
async function sendUserBannedEmail(recipientEmail, banTimeInSeconds, banPermanently, prevBanNum, banMsg) {
  const FRONTEND_BASE = process.env.FRONTEND_BASE;
  const banDuration = banPermanently ? 'permanently' : convertSecondsToDHMS(banTimeInSeconds);
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

  sgMail.setApiKey(SENDGRID_API_KEY);

  const msg = {
      to: recipientEmail,
      from: 'freezer.spa@gmail.com', // Change to your verified sender
      subject: 'UniDomus Account Ban Notification',
      text: `Dear User,

      We regret to inform you that your UniDomus account has been banned ${banPermanently ? 'permanently' : `for the following duration: ${banDuration}`}.

      Reason for ban: ${banMsg}

      This is the ${prevBanNum}° time you have been banned.

      If you believe this was a mistake or have any questions, please contact our support team.

      You can visit our homepage here: ${FRONTEND_BASE}

      Sincerely,
      The UniDomus Team`,
      html: `
      <p>Dear User,</p>
      
      <p>We regret to inform you that your UniDomus account has been banned ${banPermanently ? 'permanently' : `for the following duration: <strong>${banDuration}</strong>`}.</p>
      
      <p><strong>Reason for ban:</strong> ${banMsg}</p>
      
      <p>This is the <strong>${prevBanNum}</strong>° time you have been banned.</p>
      
      <p>If you believe this was a mistake or have any questions, please contact our support team.</p>
      
      <p>You can visit our homepage here: <a href="${FRONTEND_BASE}">UniDomus</a></p>
      
      <p>Sincerely,</p>
      <p>The UniDomus Team</p>
      `,
  };

  try {
      await sgMail.send(msg);
      console.log('User banned email sent successfully!');
  } catch (error) {
      console.error('Error sending user banned email:', error);
  }
}


/**
 * Sends an email with the notification details.
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} notificationType - The type of notification.
 * @param {string} notificationMessage - The notification message.
 * @param {string} notificationLink - The link related to the notification.
 */
async function sendNotificationEmail(recipientEmail, notificationType, notificationMessage, notificationLink = '') {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
      to: recipientEmail,
      from: 'freezer.spa@gmail.com',
      subject: 'You have a new notification from UniDomus',
      text: `${notificationMessage} ${notificationLink}`,
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2 style="color: #333;">You have a new ${notificationType} notification</h2>
              <p style="font-size: 16px; color: #555;">${notificationMessage}</p>
              ${notificationLink ? `<p><a href="${notificationLink}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">View Details</a></p>` : ''}
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 14px; color: #999;">If you have any questions, feel free to <a href="mailto:support@unidomus.com" style="color: #1a73e8; text-decoration: none;">contact our support team</a>.</p>
              <p style="font-size: 14px; color: #999;">Thank you,<br>The UniDomus Team</p>
          </div>
      `,
  };

  try {
      await sgMail.send(msg);
      console.log('Notification email sent successfully!');
  } catch (error) {
      console.error('Error sending notification email:', error);
  }
}






module.exports={
  sendEmail,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendNotificationEmail,
  sendUserDeletedEmail,
  sendUserBannedEmail
};

