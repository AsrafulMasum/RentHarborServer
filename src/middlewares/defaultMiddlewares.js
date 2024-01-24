const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { LOCAL_CLIENT, PRODUCTION_CLIENT } = require("../config/config");

const middlewares = (app) => {
  app.use(
    cors({
      origin: [LOCAL_CLIENT, PRODUCTION_CLIENT],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
};

module.exports = { middlewares };
