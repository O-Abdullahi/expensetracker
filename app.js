require("express-async-errors");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./handlers/errorHandler");
const userRoutes = require("./modules/users/users.routes.js");
const mongoose = require("mongoose");
const transactionRoutes = require("./modules/transactions/tr.routes.js");

require("dotenv").config();
PORT = process.env.PORT;

app = express();
app.use(cors());

// Database connection
mongoose
  .connect(process.env.mongodb_url, {})
  .then(() => {
    console.log("Database connected!");
  })
  .catch((e) => {
    console.log(`database connection failed.\n Reason: ${e}`);
  });

// model initialization
require("./models/users.model.js");
require("./models/transactions.model.js");
app.use(express.json());

// ROUTES ROUTES ROUTES
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
//end of all routes

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Resource Not Found",
  });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
