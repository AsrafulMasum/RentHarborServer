const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo_url: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    transactionID: {
      type: String,
      default: "",
    },
    tripList: {
      type: Array,
      default: [],
    },
    wishList: {
      type: Array,
      default: [],
    },
    propertyList: {
      type: Array,
      default: [],
    },
    reservationList: {
      type: Array,
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: Number,
      default: null,
    },
    verificationCodeExpires: {
      type: Date,
      default: null,
    },
    resendAttempt: {
      type: Number,
      default: 0,
    },
    lastResendAt: {
      type: Date,
    },
    resetPasswordCode: {
      type: Number,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpires: {
      type: Date,
      default: null,
    },
    isRequestedForHost: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
