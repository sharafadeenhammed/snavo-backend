const routes = require('express').Router();
const { protect, authorize } = require("../middleware/auth");
const {
  applyForWithdrawal,
  getWithdrawal
} = require("../controllers/withdraw");


routes.post("/:coin", protect, applyForWithdrawal);
routes.get("/:status", protect, getWithdrawal);



module.exports = routes
