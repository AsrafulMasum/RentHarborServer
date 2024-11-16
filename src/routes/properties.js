const router = require("express").Router();
const {
  gettingAllProperties,
  gettingPropertyById,
} = require("../controllers/properties");

// GETTING ALL PROPERTIES DATA
router.get("/allProperties", gettingAllProperties);

// GETTING A PROPERTY DATA BY ID
router.get("/:id", gettingPropertyById);

module.exports = router;
