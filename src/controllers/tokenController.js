const jwt = require("jsonwebtoken");
require("dotenv").config();

const createTokenController = (req, res) => {
  const user = req.body;
  try {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .send({ success: true });
  } catch (error) {
    console.log(error);
  }
};

const clearTokenController = (req, res) => {
  res.clearCookie("token", { maxAge: 0 }).send({ success: true });
};

module.exports = { createTokenController, clearTokenController };
