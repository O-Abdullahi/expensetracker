const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const mailManager = require("../../../managers/mailManager");

const forgotPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email } = req.body;
  if (!email) throw "Email is required";

  const getUser = await usersModel.findOne({ email });
  if (!getUser) throw `The email: ${email} Does Not Exist In Our System`;

  const reset_code = Math.floor(647523 + Math.random() * 90000);
  const message = `Hi ${getUser.name}, Kindly use ${reset_code} to reset your password`;
  const subject = "Password Reset-Code";

  await usersModel.updateOne(
    {
      email,
    },
    {
      reset_code,
    }
  );

  mailManager(email, message, subject);

  res.status(200).json({
    status: "Success",
    message: `Reset Link sent successfully to ${email}`,
  });
};

module.exports = forgotPassword;
