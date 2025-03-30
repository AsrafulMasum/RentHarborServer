const router = require("express").Router();
const {
  gettingAllProperties,
  gettingPropertyById,
  addingProperty,
  gettingPropertiesByHostEmail,
} = require("../controllers/properties");

// ADDING PROPERTY
router.post("/addProperty", addingProperty);

// GETTING ALL PROPERTIES DATA
router.get("/allProperties", gettingAllProperties);

// GETTING A PROPERTY DATA BY ID
router.get("/:id", gettingPropertyById);

// GETTING PROPERTIES BY HOST EMAIL
router.get("/hostProperties/:email", gettingPropertiesByHostEmail);

module.exports = router;
