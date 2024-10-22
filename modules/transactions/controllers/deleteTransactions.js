const mongoose = require("mongoose");
const validator = require("validator");
const usersModel = require("../../../models/users.model");

const deleteTx = async (req, res) => {
  //console.log(req.params);
  const usersModel = mongoose.model("users");
  const transactionsModel = mongoose.model("transactions");
  const { tx_id } = req.params;
  //console.log(tx_id);
  if (!validator.isMongoId(tx_id.toString()))
    throw "Please provide a valid transaction ID";
  const confirmTx = await transactionsModel.findOne({
    _id: tx_id,
  });
  if (!confirmTx) throw `${tx_id} match no record, please check very well!`;

  if (confirmTx.transaction_type === "income") {
    await usersModel.updateOne(
      {
        _id: confirmTx.user_id,
      },
      {
        $inc: {
          balance: confirmTx.amount * -1,
        },
      },
      {
        runValidators: true,
      }
    );
  } else {
    await usersModel.updateOne(
      {
        _id: tx_id,
      },
      {
        balance: confirmTx.amount,
      },
      {
        runValidators: true,
      }
    );
  }

  await transactionsModel.deleteOne({
    _id: tx_id,
  });
  res.status(200).json({
    status: "success",
    message: "deleted succeaafully",
  });
};

module.exports = deleteTx;
