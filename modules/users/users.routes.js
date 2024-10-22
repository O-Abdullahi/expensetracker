const express = require("express");
const register = require("./controllers/register");
const login = require("./controllers/login");
const dashboard = require("./controllers/dashboard");
//const { use } = require("express/lib/router");
const auth = require("../../middlewares/auth");
const forgotPassword = require("./controllers/forgotpw");
const resetPassword = require("./controllers/resetpw");

userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.post("/forgotpassword", forgotPassword);
userRoutes.post("/resetpassword", resetPassword);
userRoutes.use(auth);
userRoutes.get("/dashboard", dashboard);

module.exports = userRoutes;
