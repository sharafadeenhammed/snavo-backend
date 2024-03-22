const router = require("express").Router();
const {
  protect,

} = require("../middleware/auth")
const {
  getCoinAddress,
  validatePayment
} = require("../controllers/coinPayment")

router.get("/get-payment-address", protect, getCoinAddress);
router.post("/confirm", validatePayment);
router.get("/confirm", validatePayment);




module.exports = router;