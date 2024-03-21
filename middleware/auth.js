
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorMessage = require("../utils/errorMessage");

const protect = asyncHandler(async (req, res, next) => {
  const token = req?.cookies?.token?.split(" ")[ 1 ] || req?.headers?.token?.split(" ")[ 1 ];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    res.cookie("token", user.getSignedJwtToken(), {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true
    });
    req.user = user;
    if(user.accountBarred) return next(new ErrorMessage(" sorry, your account has been barred plese contact support", 401));
    next();
  } catch (error) {
    return next(new ErrorMessage("unauthorized request, please login", 401));
  }
})

const authorize = (...role) => {
  return asyncHandler(async (req, res, next) => {
    if(!role.includes(req.user.role)) return next(new ErrorMessage("unauthorized request", 401));
    next();
  })
}

module.exports = {
  protect,
  authorize
}