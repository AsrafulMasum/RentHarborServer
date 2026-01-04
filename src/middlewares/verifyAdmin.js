// const User = require("../models/User");
import User from "../models/User.js";


const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const dbUser = await User.findOne({ email: email }); 

    if (!dbUser || dbUser.role !== "Admin") {
      return res.status(403).send({ message: "Forbidden access" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export default verifyAdmin;
