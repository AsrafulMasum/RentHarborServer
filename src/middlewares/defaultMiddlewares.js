const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { LOCAL_CLIENT, PRODUCTION_CLIENT } = require("../config/config");

const middlewares = (app) => {
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://rentharbor.netlify.app",
        "http://localhost:5174",
      ],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
};

module.exports = { middlewares };
