const router = require("express").Router();
const {
  gettingAllProperties,
  gettingPropertyById,
  addingProperty,
  gettingPropertiesByHostEmail,
  gettingPropertyCategories,
} = require("../controllers/properties");

// ADDING PROPERTY
router.post("/addProperty", addingProperty);

// GETTING ALL PROPERTIES DATA
router.get("/allProperties", gettingAllProperties);

// GETTING PROPERTIES BY HOST EMAIL
router.get("/hostProperties/:email", gettingPropertiesByHostEmail);

// GETTING ALL THE CATEGORY OF PROPERTIES
router.get("/propertyCategories", gettingPropertyCategories);

// GETTING A PROPERTY DATA BY ID
router.get("/:id", gettingPropertyById);

module.exports = router;
