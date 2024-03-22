const asynchandler = require("express-async-handler");
const ErrorMessage = require("../utils/errorMessage");
const recharge = require("../models/recharge");

//@desc     get recharge history
//@route    get recharge/:status
//@access   Private
const getRecharge = asynchandler(async (req, res, next) => {
  if (req.params.status === "All") {
    const data = await recharge.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data
    });
    return;
  }
  const data = await recharge.find({ userId: req.user._id, status: req.params.status }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data
  });
  
})


module.exports = {
  getRecharge
}

