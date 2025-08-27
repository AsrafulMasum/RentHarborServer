const {
  createPaymentSession,
  paymentSuccess,
} = require("../controllers/payments");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/payment-session", verifyToken, createPaymentSession);
router.get("/payment-success", paymentSuccess);

module.exports = router;
