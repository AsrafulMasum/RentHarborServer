require("dotenv").config();
const express = require("express");
const { middlewares } = require("./src/middlewares/defaultMiddlewares");
const connectDB = require("./src/db/connectDB");
const tokenApi = require("./src/routes/token");
const userApi = require("./src/routes/auth");
const propertiesApi = require("./src/routes/properties");

const app = express();
const port = process.env.PORT || 3000;

middlewares(app);

app.use("/token", tokenApi);
app.use("/auth", userApi);
app.use("/properties", propertiesApi);

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
