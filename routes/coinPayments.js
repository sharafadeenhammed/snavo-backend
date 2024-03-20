const router = require("express").Router();
const {
  protect
} = require("../middleware/auth")
const {
  getCoinAddress
} = require("../controllers/coinPayment")

router.get("/get-payment-address", protect, getCoinAddress);
router.post("/confirm", protect, getCoinAddress);
router.get("/confirm", protect, getCoinAddress);




module.exports = router;