const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const mailManager = require("../../../managers/mailManager");

const resetPassword = async (req, res) => {
  const usersModel = mongoose.model("users");
  const { email, reset_code, password, confirmPassword } = req.body;

  if (!email) throw "email is required";
  if (!reset_code) throw "Reset Code must be provided!";
  if (!password) throw "Please provide new password";
  if (!confirmPassword || password !== confirmPassword)
    throw "password and confirm-password does not match";

  const getUserAndCode = await usersModel.findOne({
    email,
    reset_code,
  });

  if (!getUserAndCode)
    throw "Record Not Matched! Please ensure you entered correct email and reset-code";

  const hashedPassword = await bcrypt.hash(password, 12);

  await usersModel.updateOne(
    {
      email,
    },
    {
      password: hashedPassword,
      reset_code: "",
    },
    {
      runValidators: true,
    }
  );

  // mailManager(email, message, subject)

  res.status(201).json({
    status: "success",
    message: "Reset password successful",
  });
};

module.exports = resetPassword;
