const router = require("express").Router();
const {
  gettingAllProperties,
  gettingPropertyById,
  addingProperty,
  gettingPropertiesByHostEmail,
  gettingPropertyCategories,
} = require("../controllers/properties");
const verifyToken = require("../middlewares/verifyToken");

// ADDING PROPERTY
router.post("/addProperty",verifyToken, addingProperty);

// GETTING ALL PROPERTIES DATA
router.get("/allProperties", gettingAllProperties);

// GETTING PROPERTIES BY HOST EMAIL
router.get("/hostProperties/:email",verifyToken, gettingPropertiesByHostEmail);

// GETTING ALL THE CATEGORY OF PROPERTIES
router.get("/propertyCategories", gettingPropertyCategories);

// GETTING A PROPERTY DATA BY ID
router.get("/:id", verifyToken, gettingPropertyById);

module.exports = router;
