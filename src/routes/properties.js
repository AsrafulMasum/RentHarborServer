const router = require("express").Router();
const {
  gettingAllProperties,
  gettingPropertyById,
  addingProperty,
  gettingPropertiesByHostEmail,
  gettingPropertyCategories,
  gettingWishlistByUserId,
  gettingReservationListByUserId,
} = require("../controllers/properties");
const verifyToken = require("../middlewares/verifyToken");

// ADDING PROPERTY
router.post("/addProperty", verifyToken, addingProperty);

// GETTING ALL PROPERTIES DATA
router.get("/allProperties", gettingAllProperties);

// GETTING PROPERTIES BY HOST EMAIL
router.get("/hostProperties/:email", verifyToken, gettingPropertiesByHostEmail);

// GETTING ALL THE CATEGORY OF PROPERTIES
router.get("/propertyCategories", gettingPropertyCategories);

// GETTING WISHLIST BY USER ID
router.get("/wishlist", verifyToken, gettingWishlistByUserId);

// GETTING RESERVATION LIST BY USER ID
router.get("/reservations", verifyToken, gettingReservationListByUserId);

// GETTING A PROPERTY DATA BY ID
router.get("/:id", verifyToken, gettingPropertyById);

module.exports = router;
