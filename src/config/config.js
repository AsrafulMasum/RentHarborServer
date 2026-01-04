// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();

const config = {
  LOCAL_CLIENT: process.env.LOCAL_CLIENT,
  PRODUCTION_CLIENT: process.env.PRODUCTION_CLIENT,
};

export default config;
