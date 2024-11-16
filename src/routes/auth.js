const router = require("express").Router();
const {
  userRegisterController,
  userLoginController,
  gettingUserController,
} = require("../controllers/auth");

/* USER REGISTER */
router.post("/register", userRegisterController);

/* USER LOGIN*/
router.post("/login", userLoginController);

// GETTING USER DATA
router.get("/user/:id", gettingUserController);

module.exports = router;
