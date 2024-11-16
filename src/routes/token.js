const { createTokenController, clearTokenController } = require("../controllers/tokenController");

const router = require("express").Router();

router.post("/jwt", createTokenController);

router.post("/logout", clearTokenController);

module.exports = router;