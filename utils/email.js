// utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends an email using the configured transporter.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Subject of the email.
 * @param {string} options.html - HTML content of the email.
 * @returns {Promise} - Resolves when the email is sent.
 */
const sendEmail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };
    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
