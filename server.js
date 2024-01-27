const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (you need to have MongoDB installed and running)
mongoose.connect('mongodb://localhost:27017/email-scheduler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create MongoDB schema and model (you can adapt this based on your requirements)
const emailSchema = new mongoose.Schema({
  subject: String,
  body: String,
  recipients: [String],
  schedule: Date,
});

const Email = mongoose.model('Email', emailSchema);

// Middleware to parse JSON
app.use(bodyParser.json());

// Use cors middleware to handle cross-origin requests
app.use(cors());

// API endpoint for scheduling emails
app.post('/schedule-email', async (req, res) => {
  const { subject, body, recipients, schedule } = req.body;

  try {
    // Save the email details to the database
    const newEmail = new Email({
      subject,
      body,
      recipients,
      schedule,
    });

    await newEmail.save();

    res.status(201).json({ message: 'Email scheduled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to send scheduled emails
const sendScheduledEmails = async () => {
  try {
    const scheduledEmails = await Email.find({ schedule: { $lte: new Date() } });

    for (const email of scheduledEmails) {
      const transporter = nodemailer.createTransport({
        // Set up your email sending configuration
        service: 'gmail',
        auth: {
          user: 'rohitindianias@gmail.com',
          pass: 'yuvg onnb giqy yzkp',
        },
      });

      const mailOptions = {
        from: 'rohitindianias@gmail.com',
        to: email.recipients.join(', '),
        subject: email.subject,
        text: email.body,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });

      // Remove the sent email from the database
      await Email.findByIdAndDelete(email._id);
    }
  } catch (error) {
    console.error(error);
  }
};

// Schedule the email sender function to run every minute (you may need to use a more robust scheduler in production)
setInterval(sendScheduledEmails, 60000);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
