const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {sendVerificationEmail} = require("../ui/email.js");


// const userRegisterController = async (req, res) => {
//   try {
//     /* Take all information from the form */
//     const { name, email, password, photo_url, role, phone } = req.body;

//     /* Check if user exists */
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists!" });
//     }

//     /* Hash the password */
//     const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(password, salt);

//     /* Create a new User */
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       photo_url,
//       role,
//       phone,
//     });

//     /* Save the new User */
//     await newUser.save();

//     /* Send a successful message */
//     res
//       .status(200)
//       .json({ message: "User registered successfully!", success: true });
//   } catch (err) {
//     console.log(err);
//     res
//       .status(500)
//       .json({ message: "Registration failed!", error: err.message });
//   }
// };

const verifyUserController = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified!" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code!" });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Verification code expired!" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    res.json({ message: "Account verified successfully!", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Verification failed!", error: err.message });
  }
};

const userRegisterController = async (req, res) => {
  try {
    const { name, email, password, photo_url, role, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit
    const codeExpires = Date.now() + 10 * 60 * 1000; // 10 min

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      photo_url,
      role,
      phone,
      isVerified: false,
      verificationCode,
      verificationCodeExpires: codeExpires,
    });

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({
      message:
        "Registration successful! Check your email for the verification code.",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Registration failed!", error: err.message });
  }
};

const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("-transactionID");
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

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
};

const gettingUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password -transactionID");
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const userWishlistController = async (req, res) => {
  const userId = req.params.id;
  const { propertyId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const alreadyWished = user.wishList.includes(propertyId);

    if (alreadyWished) {
      user.wishList = user.wishList.filter((id) => id !== propertyId);
    } else {
      user.wishList.push(propertyId);
    }

    await user.save();
    res.status(200).json({
      message: alreadyWished
        ? "Property removed from wishlist"
        : "Property added to wishlist",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const gettingAllUserController = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Admin" } }).select(
      "-password -transactionID"
    );

    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const blockUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!user.isBlocked) {
      user.isBlocked = false;
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error blocking user:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
/*******  9ac4b01b-c4bf-40be-98dd-610a9f87b4ac  *******/

module.exports = {
  userRegisterController,
  userLoginController,
  gettingUserController,
  userWishlistController,
  gettingAllUserController,
  blockUserController,
  verifyUserController,
};
