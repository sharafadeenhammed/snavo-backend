

const routes = require('express').Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getUser,
  getUsers
} = require("../controllers/user");



routes.get("/:id", protect, getUser);
routes.get("/", protect, authorize("admin"), getUsers);

module.exports = routes;
