const router = require("express").Router();
const {
  gettingAllProperties,
  gettingPropertyById,
  addingProperty,
} = require("../controllers/properties");

// ADDING PROPERTY
router.post("/addProperty", addingProperty);

// GETTING ALL PROPERTIES DATA
router.get("/allProperties", gettingAllProperties);

// GETTING A PROPERTY DATA BY ID
router.get("/:id", gettingPropertyById);

module.exports = router;
