const routes = require('express').Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getRecharge,
  getRecharges
} = require("../controllers/recharge");


routes.get("/", protect, getRecharges);
routes.get("/:id", protect, getRecharge);



module.exports = routes
