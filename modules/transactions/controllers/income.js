const mongoose = require("mongoose");
const validator = require("validator");
const mailManager = require("../../../managers/mailManager");

const income = async (req, res) => {
  //console.log(req.user);
  const usersModel = mongoose.model("users");
  const transactionsModel = mongoose.model("transactions");
  const getUser = await usersModel.findOne({ _id: req.user.id });
  //console.log(getUser);
  const { amount, remarks } = req.body;
  const message = `Hello ${req.user.name}, ${amount} naira has been added to your balance`;
  const subject = "Credit Transaction Alert";
  if (!amount) throw "Amount is Required";
  if (amount < 0) throw "Amount can not be negative";
  if (!validator.isNumeric(amount.toString()))
    throw "Amount must be valid number.";
  if (!remarks) throw "Remarks can't be empty";
  if (remarks.length < 5) throw "Remarks should be at least 5 characters long!";
  const newBalance = getUser.balance + amount;
  //console.log(req.user);
  const updatedTx = await transactionsModel.create({
    user_id: req.user.id,
    amount: amount,
    remarks: remarks,
    previous_balance: getUser.balance,
    current_balance: newBalance,
    transaction_type: "income",
  });
  //console.log(newTx);
  await usersModel.updateOne(
    {
      _id: req.user.id,
    },
    {
      balance: updatedTx.current_balance,
    },
    {
      runValidators: true,
    }
  );

  mailManager(req.user.email, message, subject);

  res.status(200).json({
    status: "success",
    message: "Income added successfully!",
  });
};

module.exports = income;
