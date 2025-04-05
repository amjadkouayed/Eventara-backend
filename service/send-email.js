require("dotenv").config({ path: "../.env" });
const sgMail = require("@sendgrid/mail");
const apiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(apiKey);

const sendInvitation = async (to, emailData) => {
  const htmlContent = emailData.htmlContent;

  const msg = {
    to: to,
    from: "eventara701@gmail.com",
    subject: emailData.subject || "You're Invited!",
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports.sendInvitation = sendInvitation;
