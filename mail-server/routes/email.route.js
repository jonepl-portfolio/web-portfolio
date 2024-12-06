const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', (req, res) => {
  console.log("POST request received with body:", req.body);
  const { name, email, message } = req.body;
  const mailOptions = {
    from: email,
    to: process.env.FORWARDING_EMAIL,
    subject: `Web Portfolio message from ${name}`,
    text: message + ". \n\nEmail: " + email,
  };

  console.log("SMTP host", process.env.SMTP_HOST);
  console.log("SMTP port", process.env.SMTP_PORT);

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
