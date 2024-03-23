const asynchandler = require("express-async-handler");
const ErrorMessage = require("../utils/errorMessage");
const Withdraw = require("../models/withdraw");
const User = require("../models/user");

//@desc     apply for withdrawal
//@route    POST /withdraw/:coin
//@access   Private
const applyForWithdrawal = asynchandler(async (req, res, next) => {
  if (req.user.balance < req.body.amount)
    return next(new ErrorMessage("Insufficient balance", 400));
  const data = {
    ...req.body,
    status: "Pending",
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
    message: "Withdrawal request submitted successfully ✅ your withdrawal is on pending once approved it will be disbursed to the address provided. ",
  })
});

//@desc     get withdrawals based on category
//@route    GET /withdraw/:status
//@access   Private
const getWithdrawals = asynchandler(async (req, res, next) => {
  const status = req.params.status;
  if (status === "All") {
    const data = await Withdraw.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data
    });
    return;
  }

  // if status does not match
  if (status !== "Success" && status !== "Pending" && status !== "Failed") {

    const data = await Withdraw.findById(req.params.id);
    // if withdrawal not found.
    if (!data) return next(new ErrorMessage("Withdrawal not found", 404));

    // validate user
    if (data.userId !== req.user._id && req.user.role !== "admin")
      return next(new ErrorMessage("You not authorized to access this resource!", 401))

    // succesful response
      res.status(200).json({
        success: true,
        data
      })
      
    return;
  }
  const data = await Withdraw.find({ userId: req.user._id, status: req.params.status }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data
  });
});

//@desc     authorize withdrawal request
//@route    PUT /withdraw/approve/:id
//@access   Private (admin)
const approveWithdrawal = asynchandler(async (req, res, next) => {
  const withdrawal = await Withdraw.findById(req.params.id);
  if (!withdrawal) return next(new ErrorMessage("withdrawal not found", 404))
  const user = await User.findById(withdrawal.userId);
  withdrawal.status = "Success";
  await withdrawal.save();
  // TODO: send succesful withdrawal email/sms notification to user.

});

//@desc     decline withdrawal request
//@route    PUT /withdraw/decline/:id
//@access   Private (admin)
const declineWithdrawal = asynchandler(async (req, res, next) => {
  const withdrawal = await Withdraw.findById(req.params.id);
  if(!withdrawal) return next(new ErrorMessage("withdrawal not found", 404))
  const user = await User.findById(withdrawal.userId);
  withdrawal.status = "Failed";
  await withdrawal.save();
  user.balance = user.balance + withdrawal.amount;
  await user.save();
  // TODO: send failed withdrawal email/sms notification to user

});

//@desc     find single withdrawal
//@route    GET /witdraw/:id
//@access   Private 
const getWithdrawal = asynchandler(async (req, res, next) => {
  const data = await Withdraw.findById(req.params.id);
  if (!data) return next(new ErrorMessage("", 404));
  if (data.userId !== req.user._id && req.user.role !== "admin")
    return next(new ErrorMessage("You not authorized to access this resource!", 401))
  res.status(200).json({
    success: true,
    data
  })
});






module.exports = {
  applyForWithdrawal,
  getWithdrawals,
  getWithdrawal,
  approveWithdrawal,
  declineWithdrawal
}