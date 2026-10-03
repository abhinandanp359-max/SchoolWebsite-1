const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function main() {
  console.log("Using user:", process.env.EMAIL_USER);
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "mynameabhi05@gmail.com",
      subject: "Test from Nodemailer Script",
      text: "This is a test message to see if Nodemailer works."
    });
    console.log("Message sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

main();
