// const {
//   createPaymentSession,
//   paymentSuccess,
// } = require("../controllers/payments");
// const verifyToken = require("../middlewares/verifyToken");
import {
  createPaymentSession,
  paymentSuccess,
} from "../controllers/payments.js";
import verifyToken from "../middlewares/verifyToken.js";

import express from "express";
const router = express.Router();

router.post("/payment-session", verifyToken, createPaymentSession);
router.get("/payment-success", paymentSuccess);

export default router;
