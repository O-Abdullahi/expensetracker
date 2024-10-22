const mongoose = require("mongoose");
const mailManager = require("../../../managers/mailManager");
const validator = require("validator");

const expense = async (req, res) => {
  const usersModel = mongoose.model("users");
  const transactionsModel = mongoose.model("transactions");

  const { amount, remarks } = req.body;
  const getUser = await usersModel.findOne({ _id: req.user.id });

  if (!amount) throw "Amount is required";
  if (amount < 0) throw "Amount can't be Negative";
  if (amount > getUser.balance) throw "Insufficient Fund";
  //console.log(typeof amount);

  if (!remarks || remarks.length < 5)
    throw "Remarks is required and must be at least, 5 characters long!";
  if (!validator.isNumeric(amount.toString()))
    throw "Amount can only be valid number!";
  //if (typeof amount != Number) throw "Amount must be only valid number!";
  const newBalance = getUser.balance - amount;

  const newTx = await transactionsModel.create({
    user_id: req.user.id,
    amount: amount,
    previous_balance: getUser.balance,
    current_balance: newBalance,
    remarks: remarks,
    transaction_type: "expenses",
  });

  // const getTx = await transactionsModel
  //   .findOne({ user_id: req.user.id })
  //   .select("-user_id");

  await usersModel.updateOne(
    {
      _id: req.user.id,
    },
    {
      $inc: {
        balance: amount * -1,
      },
    },
    {
      runValidators: true,
    }
  );

  const subject = "Debit Transaction Alert";
  const msg = `Hello ${getUser.name}, kindly find the details of the transaction below:\n Amount: 
${newTx.amount}\n Previous Balance: ${newTx.previous_balance}\n Current Balance: ${newTx.current_balance}\n Transactiion Type: ${newTx.transaction_type}\n`;

  mailManager(getUser.email, msg, subject);

  res.status(200).json({
    status: "Success",
    message: `Balance is reduced by ${amount}`,
  });
};
module.exports = expense;
