const user = require("../models/users/user");

const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const dbUser = await user.findOne({ email: email }); 

    if (!dbUser || dbUser.role !== "admin") {
      return res.status(403).send({ message: "Forbidden access" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = verifyAdmin;
