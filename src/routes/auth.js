const router = require("express").Router();
const {
  userRegisterController,
  userLoginController,
  gettingUserController,
  userWishlistController,
  gettingAllUserController,
  blockUserController,
} = require("../controllers/auth");
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyToken = require("../middlewares/verifyToken");

/* USER REGISTER */
router.post("/register", userRegisterController);

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

module.exports = router;
