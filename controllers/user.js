

const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const paginate = require("../utils/paginate");
const ErrorMessage = require("../utils/errorMessage");

const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if(!user) return next(new ErrorMessage("user not found", 404));
  res.status(200).json({
    success: true,
    user
  })
}) 

const getUsers = asyncHandler(async (req, res, next) => {
  const data = await paginate(User, req);
  res.json({
    success: true,
    ...data
  })
});

const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if(!user) return next(new ErrorMessage("user not found", 404));
  res.status(200).json({
    success: true,
    user
  })
})



  module.exports = {
    getUser,
    getUsers,
    updateUser
}