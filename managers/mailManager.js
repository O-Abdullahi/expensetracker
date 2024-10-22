const nodemailer = require("nodemailer");

const mailManager = async (email, msg, subject) => {
  let transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "89758007c770d2",
      pass: "c44dd896cfb0de",
    },
  });

  await transport.sendMail({
    to: email,
    from: "info@gotracker.ng",
    text: msg,
    subject,
  });
};
module.exports = mailManager;
