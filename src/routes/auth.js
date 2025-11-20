const router = require("express").Router();
const {
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
} = require("../controllers/auth");
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyToken = require("../middlewares/verifyToken");

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

// UPDATING USER ROLE
router.put("/update-role/:userId", verifyAdmin, updateUserRoleController);

module.exports = router;
