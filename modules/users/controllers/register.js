const mongoose = require("mongoose");

const letHash = require("bcrypt");

const jwtManager = require("../../../managers/jwtManagers");
const mailManager = require("../../../managers/mailManager");

const register = async (req, res) => {
  //console.log(req);
  const usersModel = mongoose.model("users");
  const { name, email, password, confirmpassword, balance } = req.body;

  // if (!name) throw "name is required";
  // if (!email) throw "email is required";
  if (!password || password.length < 8)
    throw "password must be provided and at least 8 characters long";
  if (password !== confirmpassword) throw "password doesn't match";
  //if (!balance) throw "user balance can not be null";
  const emailDuplicateChecker = await usersModel.findOne({ email });
  if (emailDuplicateChecker) throw "User with this email already exist";
  const hashedPassword = await letHash.hash(password, 11);
  const message = `Hi ${name}, Welcome to GO-tracker. We aim to help you mindful of your spendings!`;
  const subject = `"Welcome Message"`;
  const newUser = await usersModel.create({
    name,
    email,
    password: hashedPassword,
    balance,
  });

  newUserToken = jwtManager(newUser);

  mailManager(email, message, subject);

  res.status(201).json({
    status: "Successful",
    msg: "Thanks for register",
    token: newUserToken,
  });
};

module.exports = register;
