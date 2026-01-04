// import express from "express";
import express from "express";
const router = express.Router();

// const {
//   userRegisterController,
//   userLoginController,
//   gettingUserController,
//   userWishlistController,
//   gettingAllUserController,
//   blockUserController,
//   verifyUserController,
//   resendVerificationCodeController,
//   forgotPasswordController,
//   verifyResetCodeController,
//   resetPasswordController,
//   updateUserDetailsController,
//   changePasswordController,
//   updateUserRoleController,
//   updateHostRequestController,
//   getAllRequestedHostsController,
//   becomeAHostController,
// } = require("../controllers/auth");
// const upload = require("../middlewares/upload");
// const verifyAdmin = require("../middlewares/verifyAdmin");
// const verifyToken = require("../middlewares/verifyToken");
import {
  userRegisterController,
  userLoginController,
  gettingUserController,
  userWishlistController,
  gettingAllUserController,
  blockUserController,
  verifyUserController,
  resendVerificationCodeController,
  forgotPasswordController,
  verifyResetCodeController,
  resetPasswordController,
  updateUserDetailsController,
  changePasswordController,
  updateUserRoleController,
  updateHostRequestController,
  becomeAHostController,
  getAllRequestedHostsController,
} from "../controllers/auth.js";

import upload from "../middlewares/upload.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

/* USER REGISTER */
router.post("/register", userRegisterController);

/* USER VERIFY */
router.post("/verify", verifyUserController);

/* FORGOT PASSWORD */
router.post("/forgot-password", forgotPasswordController);

/* VERIFY RESET CODE */
router.post("/verify-reset-code", verifyResetCodeController);

/* RESET PASSWORD */
router.post("/reset-password", resetPasswordController);

/* RESEND CODE */
router.post("/resend", resendVerificationCodeController);

/* UPDATE USER */
router.put("/update-user/:userId", verifyToken, updateUserDetailsController);

/* CHANGE PASSWORD */
router.put("/update-Password/:userId", verifyToken, changePasswordController);

/* USER LOGIN*/
router.post("/login", userLoginController);

// GETTING USER DATA
router.get("/user/:id", gettingUserController);

// UPDATING USER WISHLIST
router.post("/wishList/:id", userWishlistController);

// GETTING ALL USERS
router.get("/admin/users", verifyToken, verifyAdmin, gettingAllUserController);

// BLOCKING A USER
router.post("/block-user/:id", verifyToken, verifyAdmin, blockUserController);

// REQUESTING TO BE A HOST
// router.patch("/request-host/:userId", verifyToken, updateHostRequestController);
router.post(
  "/request-host/:userId",
  // verifyToken,
  upload.fields([
    { name: "nidOrPassport", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "certification", maxCount: 1 },
  ]),
  becomeAHostController
);

// GETTING ALL REQUESTED USER
router.get(
  "/requested/hosts",
  verifyToken,
  verifyAdmin,
  getAllRequestedHostsController
);

// UPDATING USER ROLE
router.put("/update-role/:userId", verifyAdmin, updateUserRoleController);

export default router;
