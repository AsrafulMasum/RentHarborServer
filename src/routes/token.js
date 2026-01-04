// const { createTokenController, clearTokenController } = require("../controllers/tokenController");
// import { createTokenController, clearTokenController } from "../controllers/tokenController.js";

import express from "express";
import tokenController from "../controllers/tokenController.js";

const { createTokenController, clearTokenController } = tokenController;

const router = express.Router();

router.post("/jwt", createTokenController);

router.post("/logout", clearTokenController);

export default router;