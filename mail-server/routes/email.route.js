const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

console.log('Pre transport, EMAIL_USER:', process.env.EMAIL_USER, "...");
console.log('Pre transport, EMAIL_PASS:', process.env.EMAIL_PASS, "...");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true, // Enables logging
  debug: true,  // Enables detailed debugging
});

console.log('Post transport, EMAIL_USER:', process.env.EMAIL_USER, "...");
console.log('Post transport, EMAIL_PASS:', process.env.EMAIL_PASS, "...");

// POST /send-email route
router.post('/', (req, res) => {
  console.log("POST request received with body:", req.body);
  const { name, email, message } = req.body;
  const mailOptions = {
    from: email,
    to: process.env.FORWARD_EMAIL_USER,
    subject: `Web Portfolio message from ${name}`,
    text: message + ". \n\nEmail: " + email,
  };

  console.log(process.env.EMAIL_HOST);
  console.log(process.env.EMAIL_PORT);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent');
  });
});

module.exports = router;
