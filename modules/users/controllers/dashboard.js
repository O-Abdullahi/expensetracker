const mongoose = require("mongoose");

const dashboard = async (req, res) => {
  const usersModel = mongoose.model("users");
  const transactionsModel = mongoose.model("transactions");

  const getUser = await usersModel.findById(req.user.id).select("-password");
  const getFiveTransaction = await transactionsModel
    .find({
      user_id: req.user.id,
    })
    .sort("-createdAt")
    .limit(5);

  res.status(200).json({
    status: "success",
    data: getUser,
    transactions: getFiveTransaction,
  });
};

module.exports = dashboard;
