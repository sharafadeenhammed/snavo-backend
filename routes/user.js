

const routes = require('express').Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getUser,
  getUsers,
  updateUser
} = require("../controllers/user");



routes.route("/:id")
  .get(protect, getUser)
  .put(protect, authorize("admin"), updateUser);

routes.get("/", protect, authorize("admin"), getUsers);

module.exports = routes;
