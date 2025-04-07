const sgMail = require("@sendgrid/mail");

const sendEmail = async (to, subject, text, html) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY); 
  const msg = {
    to,
    from: process.env.SENDER_EMAIL,
    subject,
    text,
    html,
  };

  try {
    return await sgMail.send(msg);
  } catch (error) { 
    throw error;
  }
};

module.exports = { sendEmail };
