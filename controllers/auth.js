const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");
const randomString = require("randomstring");
const ErrorClass = require("../utils/errorClass");
const { registerationSchema, loginSchema } = require("../utils/validationSchema");
const User = require("../models/user.js");


const register = asynchandler(async (req, res, next) => {
  const defaultReferalCode = "EJFDS";
  // check if passwords match code is valid
  if(req.body.password !== req.body.confirmPassword)
    return next(new ErrorClass("password and confirm password does not match", 400));

  // validate user input...
  const validate = registerationSchema.validate(req.body);
  if (validate.error) {
    return next(new ErrorClass(validate.error.details[0].message,400));
  }
  
  // constructing completed user data object
  const userData = {
    ...req.body,
    balance:3.00,
    uid:randomString.generate({
      length: 6,
      charset: "numeric"
    }),
    referalCode: randomString.generate({
      length: 8,
      charset: "alphabetic"
    }).toUpperCase(),
    registerationReferalCode : defaultReferalCode === req.body.referalCode ? "" : req.body.referalCode
  }

  const user = await User.create(userData);
  const createdUser = await User.findById(user._id);
  const token = createdUser.getSignedJwtToken();

  res.cookie("token",token , {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }).json({
    success: true,
    user: createdUser,
    token
  })

})

const login = asynchandler(async (req, res, next) => {
  // validate user input...
  const validate = loginSchema.validate(req.body);
  if (validate.error) {
    return next(new ErrorClass(validate.error.details[0].message,400));
  }

  // find user in database...
  const user = await User.findOne({ phone: req.body.phone }).select("+password");

  // if user not found...
  if (!user) {
    return next(new ErrorClass("incorrect phone or password", 404));
  }

  // validate password...
  if(!await user.matchPassword(req.body.password)) return res.status(400).json({
    success: false,
    message:"incorrect phone or password"
  })

  // get user from database without password...
  const getLoggedInUser = await User.findOne({ phone: req.body.phone });

  // generate auth token...
  const token = getLoggedInUser.getSignedJwtToken();
  res.cookie("token",token , {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }).json({
    success: true,
    user: getLoggedInUser,
    token
  })
  
})

const getLoggedInUser = asynchandler(async (req, res, next) => {
  res.status(200);
  res.json({
    success: true,
    user: req.user,
    token : req.user.getSignedJwtToken()
  })
})


module.exports = {
  register,
  login,
  getLoggedInUser
}