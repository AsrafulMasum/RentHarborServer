// require("dotenv").config();
// const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized Access" });
    }
    req.decoded = decoded;
    next();
  });
};

export default verifyToken;
