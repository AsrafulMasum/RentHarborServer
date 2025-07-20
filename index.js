require("dotenv").config();
const express = require("express");
const { middlewares } = require("./src/middlewares/defaultMiddlewares");
const connectDB = require("./src/db/connectDB");
const tokenApi = require("./src/routes/token");
const userApi = require("./src/routes/auth");
const propertiesApi = require("./src/routes/properties");
const paymentApi = require("./src/routes/payments");
const { default: Stripe } = require("stripe");
const { paymentSuccessfull } = require("./src/ui/tamplete");

const app = express();
const port = process.env.PORT || 3000;

middlewares(app);

app.use("/token", tokenApi);
app.use("/auth", userApi);
app.use("/properties", propertiesApi);
app.use("/payments", paymentApi);

app.get("/", (req, res) => {
  res.send("server is running data will be appear soon...");
});

app.get("/payment-seccess", async (req, res) => {
  const metadata = req?.query?.session_id;
  const checkout = await Stripe.checkout.sessions.retrieve(metadata);
  console.log(checkout);
  res.send(paymentSuccessfull);
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