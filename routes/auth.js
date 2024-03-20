const express = require('express')
const {protect} = require("../middleware/auth")
const {
  register,
  login,
  getLoggedInUser,
  getToken
} = require("../controllers/auth")

const routes = express.Router();


routes.post("/register", register);
routes.post("/login", login);
routes.post("/get-token", getToken);
routes.get("/getme", protect, getLoggedInUser);

module.exports = routes