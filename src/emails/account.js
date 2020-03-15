const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "minoales@seznam.cz",
    subject: "Thanks for joining in !",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
  });
};

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "minoales@seznam.cz",
    subject: "Hopefully you have enjoyed our app !",
    text: `Goodbye, ${name}. If you have any specifing reasons to leave us, just give us a feedback.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
};
