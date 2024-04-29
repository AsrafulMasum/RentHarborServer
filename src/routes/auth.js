const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

/* USER REGISTER */
router.post("/register", async (req, res) => {
  try {
    /* Take all information from the form */
    const { firstName, lastName, email, password, photo_url, role, phone } =
      req.body;

    /* Check if user exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    /* Hash the password */
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    /* Create a new User */
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      photo_url,
      role,
      phone,
    });

    /* Save the new User */
    await newUser.save();

    /* Send a successful message */
    res
      .status(200)
      .json({ message: "User registered successfully!", success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Registration failed!", error: err.message });
  }
});

/* USER LOGIN*/
router.post("/login", async (req, res) => {
  try {
    /* Take the infomation from the form */
    const { email, password } = req.body;

    /* Check if user exists */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    /* Compare the password with the hashed password */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }
    delete user.password;
    res.status(200).json({ user, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// GETTING USER DATA
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
