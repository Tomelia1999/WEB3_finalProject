const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(express.json());

app.use(cors());

const transporter = nodemailer.createTransport({
  // Configure your email provider settings here
  service: 'gmail',
  auth: {
    user: 'yair.nagar7@gmail.com',
    pass: '0524735100' // Use an app-specific password if using Gmail
  }
});

app.post('/send-email', (req, res) => {
  const { recipient, subject, text } = req.body;

  console.log(recipient, subject, text);

  const mailOptions = {
    from: 'yair.nagar7@gmail.com',
    to: recipient,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
