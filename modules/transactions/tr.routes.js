const express = require("express");
const auth = require("../../middlewares/auth");
const income = require("./controllers/income");
const expense = require("./controllers/expenses");
const getTransactions = require("./controllers/getTransactions");
const deleteTx = require("./controllers/deleteTransactions");

const transactionRoutes = express.Router();

transactionRoutes.use(auth);
transactionRoutes.post("/addincome", income);
transactionRoutes.post("/removexpense", expense);
transactionRoutes.get("/", getTransactions);
transactionRoutes.delete("/:tx_id", deleteTx);

module.exports = transactionRoutes;
