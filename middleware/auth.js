
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
ErrorClass = require("../utils/errorClass");

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
    next();
  } catch (error) {
    console.log(error.message);
    return next(new ErrorClass("unauthorized request, please login", 401));
  }
})

module.exports = {
  protect
}