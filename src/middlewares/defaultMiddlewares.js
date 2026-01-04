// const cors = require("cors");
// const express = require("express");
// const cookieParser = require("cookie-parser");
// const { LOCAL_CLIENT, PRODUCTION_CLIENT } = require("../config/config");
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
// import { LOCAL_CLIENT, PRODUCTION_CLIENT } from "../config/config.js";
import config from "../config/config.js";

const { LOCAL_CLIENT, PRODUCTION_CLIENT } = config;


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

export default  middlewares ;
