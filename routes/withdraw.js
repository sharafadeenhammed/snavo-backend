const routes = require('express').Router();
const { protect, authorize } = require("../middleware/auth");
const {
  applyForWithdrawal,
  getWithdrawals,
  getWithdrawal,
  approveWithdrawal,
  declineWithdrawal

} = require("../controllers/withdraw");


routes.post("/:coin", protect, applyForWithdrawal);
routes.get("/:status", protect, getWithdrawals);
routes.put("/approve/:id", protect, authorize("admin"), approveWithdrawal);
routes.put("/dcline/:id", protect, authorize("admin"), declineWithdrawal);



module.exports = routes
