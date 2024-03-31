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
    pass: 'zerj gxvx ojsa pgoo' 
  }, 
  debug: true
});

app.post('/send-email', (req, res) => {
  const { recipient, subject, text, url} = req.body;

const mailOptions = {
  from: 'BLOCK-TICKET',
  to: recipient,
  subject: subject,
  html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Block-Ticket</h2>
    <p>${text}</p>
    <p style="margin-top: 20px;">View details <a href="${url}" style="color: #007bff; text-decoration: none;">here</a></p>
  </div>
`
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
