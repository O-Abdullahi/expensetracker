const mongoose = require("mongoose");
const letHash = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManagers");

const login = async (req, res) => {
  // console.log(req);
  const usersModel = mongoose.model("users");
  const { email, password } = req.body;
  const validateUser = await usersModel.findOne({ email });
  if (!validateUser) throw "User with this email does not exist";
  const validatePassword = await letHash.compare(
    password,
    validateUser.password
  );
  if (!validatePassword)
    throw `Password Error: ${password} is INCORRECT for ${email}`;
  const jwbToken = jwtManager(validateUser);
  res.status(200).json({
    status: "Successful",
    msg: "Login is successful",
    token: jwbToken,
  });
};

module.exports = login;
