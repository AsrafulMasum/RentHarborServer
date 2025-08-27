require("dotenv").config();
const express = require("express");
const { middlewares } = require("./src/middlewares/defaultMiddlewares");
const connectDB = require("./src/db/connectDB");
const tokenApi = require("./src/routes/token");
const userApi = require("./src/routes/auth");
const propertiesApi = require("./src/routes/properties");
const paymentApi = require("./src/routes/payments");
// const { default: Stripe } = require("stripe");
const { paymentSuccessful } = require("./src/ui/tamplete");
const { _newStripe } = require("./src/controllers/payments");
const User = require("./src/models/User");

const app = express();
const port = process.env.PORT || 3000;

middlewares(app);

app.get("/payment-success", async (req, res) => {
  const sessionId = req?.query?.session_id;
  const checkout = await _newStripe.checkout.sessions.retrieve(sessionId);
  if (checkout.payment_status !== "paid") {
    return res.send({
      success: false,
      status: 400,
      message: "Payment Unsuccessful!",
    });
  }

  const hostEmail = checkout?.metadata?.hostEmail;
  const userId = checkout?.metadata?.userId;
  const propertyId = checkout?.metadata?.propertyId;
  const startDate = checkout?.metadata?.startDate;
  const endDate = checkout?.metadata?.endDate;

  const reservationData = {
    propertyId,
    startDate,
    endDate,
  };

  const user = await User.findById(userId);

  if (!user.transactionID || user.transactionID === "") {
    return res.send("Payment Failed");
  }

  if (user.transactionID != sessionId) {
    return res.send("Payment Failed");
  }

  user.reservationList.push(reservationData);
  await user.save();

  res.send(paymentSuccessful);
});

app.use("/token", tokenApi);
app.use("/auth", userApi);
app.use("/properties", propertiesApi);
app.use("/payments", paymentApi);

app.get("/", (req, res) => {
  res.send("server is running data will be appear soon...");
});

app.all("*", (req, res, next) => {
  const err = new Error(`The requested url is invalid [${req.url}].`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

const main = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
  });
};

main();

// "type": "module",
