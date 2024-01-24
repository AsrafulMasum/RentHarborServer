const mongoose = require("mongoose");
require("dotenv").config();

const getURI = () => {
  let connectionURI = process.env.URI;

  connectionURI = connectionURI.replace("<username>", process.env.DB_USER);

  connectionURI = connectionURI.replace("<password>", process.env.DB_PASS);

  return connectionURI;
};

const connectDB = async () => {
  const mongoURI = getURI();
  try {
    await mongoose.connect(mongoURI, {
      dbName: "RentHarbor",
    });
    console.log("DB Connected Successfully✅");
  } catch (error) {
    console.log(error.name, error.message);
  }
};

module.exports = connectDB;
