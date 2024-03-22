const asynchandler = require("express-async-handler");
const ErrorMessage = require("../utils/errorMessage");
const Withdraw = require("../models/withdraw");

const applyForWithdrawal = asynchandler(async (req, res, next) => {
  if (req.user.balance < req.body.amount)
    return next(new ErrorMessage("Insufficient balance", 400));
  const data = {
    ...req.body,
    status:"Pending",
    userId: req.user._id,
  }

  // ccreate withdraw transaction
  const withdraw = await Withdraw.create(data);
  if (!withdraw) return next(new ErrorMessage("Withdrawal request failed", 500));

  // update user balance
  req.user.balance = req.user.balance - req.body.amount;
  await req.user.save();

  res.status(200).json({
    success: true,
    message:"Withdrawal request submitted successfully ✅ your withdrawal is on pending once approved it will be disbursed to the address provided. ",
  })
})


const getWithdrawal = asynchandler(async (req, res, next) => {
  if (req.params.status === "All") {
    const data = await Withdraw.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data
    });
    return;
  }
  const data = await Withdraw.find({ userId: req.user._id, status: req.params.status }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data
  });
})






module.exports = {
  applyForWithdrawal,
  getWithdrawal
}