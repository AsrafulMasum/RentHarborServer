// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
// const { sendVerificationEmail } = require("../ui/email.js");

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../ui/email.js";

// USER VERIFICATION
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

    if (user.verificationCode !== Number(code)) {
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

// RESEND VERIFICATION CODE
const resendVerificationCodeController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified!" });
    }

    if (
      user.lastResendAt &&
      Date.now() - user.lastResendAt.getTime() < 60 * 1000
    ) {
      return res.status(429).json({
        message:
          "Please wait at least 1 minute before requesting another verification code.",
      });
    }

    // Generate new OTP
    const newCode = Math.floor(100000 + Math.random() * 900000);
    const expiresIn = Date.now() + 5 * 60 * 1000;

    user.verificationCode = newCode;
    user.verificationCodeExpires = expiresIn;
    user.lastResendAt = new Date();
    user.resendAttempt = (user.resendAttempt || 0) + 1;

    await user.save();

    // Send email
    await sendVerificationEmail(email, newCode);

    res.status(200).json({
      message: "Verification code resent successfully!",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to resend code.",
      error: err.message,
    });
  }
};

// FORGOT PASSWORD
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const code = Math.floor(100000 + Math.random() * 900000);

    user.resetPasswordCode = code;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(email, code);

    res.json({ message: "Reset code sent!", success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed!", error: err.message });
  }
};

// VERIFY RESET CODE
const verifyResetCodeController = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.resetPasswordCode !== Number(code))
      return res.status(400).json({ message: "Invalid reset code!" });

    if (user.resetPasswordExpires < Date.now())
      return res.status(400).json({ message: "Reset code expired!" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    // user.resetPasswordCode = undefined;
    // user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      message: "Code verified!",
      resetToken,
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Verification failed!", error: err.message });
  }
};

// RESET PASSWORD
const resetPasswordController = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Find user by resetToken and ensure token is not expired
    const user = await User.findOne({
      resetPasswordToken: resetToken,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token!" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    await user.save();

    res.json({ message: "Password reset successful!", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Password reset failed!", error: err.message });
  }
};

// UPDATE USER DETAILS
const updateUserDetailsController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, photo_url } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (photo_url) user.photo_url = photo_url;

    await user.save();

    res.status(200).json({
      message: "User details updated successfully!",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        photo_url: user.photo_url,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update user details!",
      error: err.message,
    });
  }
};

// CHANGE PASSWORD
const changePasswordController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect!" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully!",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to change password!",
      error: err.message,
    });
  }
};

// USER REGISTER
const userRegisterController = async (req, res) => {
  try {
    const { name, email, password, photo_url, role, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const codeExpires = Date.now() + 5 * 60 * 1000;

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

// USER LOGIN
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("-transactionID");
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "User is not verified!" });
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

// GET USER
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

// USER WISHLIST
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

// GET ALL USER
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

// BLOCK USER
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

// UPDATE HOST REQUEST
const updateHostRequestController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isRequestedForHost } = req.body;

    // Validate boolean
    if (typeof isRequestedForHost !== "boolean") {
      return res
        .status(400)
        .json({ message: "isRequestedForHost must be a boolean value" });
    }

    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check user role
    if (user.role !== "Guest") {
      return res.status(403).json({
        message: "Only Guest users can request to become a host!",
      });
    }

    // Update field
    user.isRequestedForHost = isRequestedForHost;
    await user.save();

    res.status(200).json({
      message: "Host request status updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// BECOME A HOST
const becomeAHostController = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.role !== "Guest") {
      return res.status(403).json({
        message: "Only Guest users can request to become a host!",
      });
    }

    if (user.isRequestedForHost) {
      return res.status(400).json({
        message: "You have already requested to become a host! Please wait.",
      });
    }

    // Validate file uploads
    if (!req.files || !req.files.nidOrPassport || !req.files.addressProof) {
      return res.status(400).json({
        message:
          "Missing required files: NID/Passport and Address Proof must be uploaded!",
      });
    }

    // Attach uploaded files
    user.nidOrPassportFile = req.files.nidOrPassport[0].path;
    user.addressProofFile = req.files.addressProof[0].path;

    // Optional file
    if (req.files.certification) {
      user.certificationFile = req.files.certification[0].path;
    }

    // mark the user requested
    user.isRequestedForHost = true;

    await user.save();

    res.status(200).json({
      message: "Host request submitted successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL REQUESTED HOST
const getAllRequestedHostsController = async (req, res) => {
  try {
    const requestedUsers = await User.find({
      isRequestedForHost: true,
      role: "Guest",
    }).select("-password");

    res.status(200).json({
      message: "Requested host users fetched successfully",
      count: requestedUsers.length,
      users: requestedUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE USER ROLE
const updateUserRoleController = async (req, res) => {
  const ALLOWED_ROLES = ["Guest", "Host", "Admin"];

  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role input
    if (!role || !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed roles: Guest, Host, Admin",
      });
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully!",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating role:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export {
  userRegisterController,
  userLoginController,
  gettingUserController,
  userWishlistController,
  gettingAllUserController,
  blockUserController,
  verifyUserController,
  resendVerificationCodeController,
  forgotPasswordController,
  resetPasswordController,
  verifyResetCodeController,
  updateUserDetailsController,
  changePasswordController,
  updateUserRoleController,
  updateHostRequestController,
  getAllRequestedHostsController,
  becomeAHostController,
};
