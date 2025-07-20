const { createPaymentSession } = require("../controllers/payments");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

router.post("/payment-session", verifyToken, createPaymentSession);

module.exports = router;
