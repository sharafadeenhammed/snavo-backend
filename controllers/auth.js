const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");
const message = require("../utils/message");
const randomString = require("randomstring");
const ErrorMessage = require("../utils/errorMessage");
const paginate = require("../utils/paginate");
const { registerationSchema, loginSchema } = require("../utils/validationSchema");
const User = require("../models/user.js");
const Recharge = require("../models/recharge");
const Referal = require("../models/referal");
const {
  get_callaback
} = require("../utils/coin");


//@desc     register
//@route    POST auth/register
//@access   Public
const register = asynchandler(async (req, res, next) => {
  const defaultReferalCode = "EJFDS";
  let refererUser = {};
  // check if passwords match code is valid
  if(req.body.password !== req.body.confirmPassword)
    return next(new ErrorMessage("password and confirm password does not match", 400));

  // validate user input...
  const validate = registerationSchema.validate(req.body);
  if (validate.error) {
    return next(new ErrorMessage(validate.error.details[0].message,400));
  }


  // constructing completed user data object
  const userData = {
    ...req.body,
    balance:3.00,
    uid:randomString.generate({
      length: 8,
      charset: "numeric"
    }),
    referalCode: randomString.generate({
      length: 10,
      charset: "alphabetic"
    }).toUpperCase(),
    registerationReferalId : refererUser?._id || null,
  }

  const user = await User.create(userData);

  // get coin address for user
  const coinAddress = await get_callaback("USDT", user);

  // update user with coin address.
  user.coinAddress = coinAddress.address;
  await user.save();

   // find referer user
   if (defaultReferalCode !== req.body.referalCode) {
    refererUser = await User.findOne({ referalCode: req.body.referalCode });
  }

  if (refererUser) {
    refererUser.refererCount = refererUser.refererCount + 1;
    await refererUser.save();
  }

  // find user in database
  const createdUser = await User.findById(user._id);
  const token = createdUser.getSignedJwtToken();

  res.cookie("token", token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }).status(201).json({
    success: true,
    user: createdUser,
    token
  });

  // create sign up bonus recharge
  const recharge = await Recharge.create({
    amount: 3.00,
    rechargeType: "reward",
    status: "Success",
    userId: user._id
  });


})

//@desc     register
//@route    POST auth/login
//@access   Public
const login = asynchandler(async (req, res, next) => {
  // validate user input...
  const validate = loginSchema.validate(req.body);
  if (validate.error) {
    return next(new ErrorMessage(validate.error.details[ 0 ].message, 400));
  }

  // find user in database...
  const user = await User.findOne({ phone: req.body.phone }).select("+password");

  // if user not found...
  if (!user) {
    return next(new ErrorMessage("incorrect phone or password", 404));
  }

  // validate password...
  if (!await user.matchPassword(req.body.password)) return res.status(400).json({
    success: false,
    message: "incorrect phone or password"
  });

  // check if account not barred
  if(user.accountBarred) return next(new ErrorMessage(" sorry, your account has been barred plese contact support", 401));

  // get user from database without password...
  const getLoggedInUser = await User.findOne({ phone: req.body.phone });

  // generate auth token...
  const token = getLoggedInUser.getSignedJwtToken();
  res.cookie("token", token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }).json({
    success: true,
    user: getLoggedInUser,
    token
  });
  
});

//@desc     get Currently logged in user
//@route    get auth/getme
//@access   Private
const getLoggedInUser = asynchandler(async (req, res, next) => {
  res.status(200);
  res.json({
    success: true,
    user: req.user,
    token: req.user.getSignedJwtToken()
  });
});

//@desc     get token
//@route    POST /auth/gettoken
//@access   Public
const getToken = asynchandler(async (req, res, next) => {
  let user;
  if (req.body.channel === "phone")
    user = await User.findOne({ phone: req.body.to });
  if (req.body.channel === "email")
    user = await User.findOne({ email: req.body.to });
  if (!user) return next(new ErrorMessage(`Please enter a valid  ${req.body.channel} `,404));

  // generate otp code
  const otp = user.getResetPasswordToken();
  
  // save otp in database
  await user.save();

  // send otp as message
  const messageResponse = await message(otp, req.body.to, req.body.channel);
  if(!messageResponse.success) return next(new ErrorMessage(messageResponse.message, 500));
  
  // return success message
  res.status(200).json({
    success: true,
    message: messageResponse.message
  });
  
});

const getUser = asynchandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user) return next(new ErrorMessage("user not found", 404));
  res.status(200).json({
    success: true,
    user
  })
})

const getUsers = asynchandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users
  })
})


module.exports = {
  register,
  login,
  getLoggedInUser,
  getToken,
  getUser
}