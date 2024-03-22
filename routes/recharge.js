const routes = require('express').Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getRecharge
} = require("../controllers/recharge");


routes.get("/:status", protect, getRecharge);



module.exports = routes
