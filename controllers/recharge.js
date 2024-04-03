const asynchandler = require("express-async-handler");
const ErrorMessage = require("../utils/errorMessage");
const Recharge = require("../models/recharge");
const paginate = require("../utils/paginate");

//@desc     get recharge history
//@route    get recharge/:status
//@access   Private
const getRecharges = asynchandler(async (req, res, next) => {
  const data = await paginate(Recharge, req, { userId: req.user._id });
  res.status(200).json({
    success: true,
    ...data
  });
})

const getRecharge = asynchandler(async (req, res, next) => {
  const data = await Recharge.findById(req.params.id);
  console.log(data);
  if(!data) return next(new ErrorMessage("recharge not found", 404));
  if(data.userId !== req.user._id) return next(new ErrorMessage("unauthorized access", 401));
  res.status(200).json({
    success: true,
    data
  })
})


module.exports = {
  getRecharges,
  getRecharge
}

