const asynchandler = require("express-async-handler");
const ErrorMessage = require("../utils/errorMessage");
const {
  get_callaback
} = require("../utils/coin");

//@desc     get coin address
//@route    get coin/get-payment-address
//@access   Private
const getCoinAddress = asynchandler(async (req, res, next) => {
  const response = await get_callaback(req.body.coin, req.user);
  if(!response.success) return next(new ErrorMessage(response.message, 401));
  res.status(200).json({
    ...response
  })
 })

module.exports = {
  getCoinAddress
}