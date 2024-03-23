const asynchandler = require("express-async-handler");
const ErrorMessage = require("../utils/errorMessage");
const {
  get_callaback
} = require("../utils/coin");

//@desc     get coin address
//@route    get coin/get-payment-address
//@access   Private
const getCoinAddress = asynchandler(async (req, res, next) => {

  // check if user have coin address
  if (req.user.coinAddress !== "")
    return res.status(200).json({
      success: true,
      address: req.user.coinAddress,
      coin: req.body.coin
    })
  
  // get coin address for user
  const coinAddress = await get_callaback(req.body.coin, req.user);

  // update user with coin address.
  req.user.coinAddress = coinAddress.address;
  await user.save();
  
  if(!coinAddress.success) return next(new ErrorMessage(coinAddress.message, 401));
  res.status(200).json({
    ...coinAddress
  })
})

//@desc     get coin address
//@route    get|post coin/confirm
//@access   public
 const validatePayment = asynchandler(async (req, res, next) => {
   console.log("body: ", req.body);
   console.log("params: ", req.params);
 })

module.exports = {
  getCoinAddress,
  validatePayment
}