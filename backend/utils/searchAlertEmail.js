const mailgun = require("mailgun-js");
const dotenv = require('dotenv');
dotenv.config();

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const searchAlertEmail = async (to, subject, text) => {
  
  const data = {
    from: "traininghorizonco@gmail.com",
    to,
    subject,
    text,
    // html: html || text,
  };

  try {
    await mg.messages().send(data);
    console.log("E-mail sent successfully!!");
  } catch (error) {
    console.log("Error sending email", error);
  }
};

module.exports = searchAlertEmail;
