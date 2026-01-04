import express from "express";
const router = express.Router();
// const {
//   gettingAllProperties,
//   gettingPropertyById,
//   addingProperty,
//   gettingPropertiesByHostEmail,
//   gettingPropertyCategories,
//   gettingWishlistByUserId,
//   gettingReservationListByUserId,
//   blockProperty,
//   gettingAllPropertiesForAdmin,
// } = require("../controllers/properties");
// const verifyAdmin = require("../middlewares/verifyAdmin");
// const verifyToken = require("../middlewares/verifyToken");
import {
  gettingAllProperties,
  gettingPropertyById,
  addingProperty,
  gettingPropertiesByHostEmail,
  gettingPropertyCategories,
  gettingWishlistByUserId,
  gettingReservationListByUserId,
  blockProperty,
  gettingAllPropertiesForAdmin,
} from "../controllers/properties.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

// ADDING PROPERTY
router.post("/addProperty", verifyToken, addingProperty);

// GETTING ALL PROPERTIES DATA
router.get("/allProperties", gettingAllProperties);

// GETTING ALL PROPERTIES DATA FOR ADMIN
router.get(
  "/admin/allProperties",
  verifyToken,
  verifyAdmin,
  gettingAllPropertiesForAdmin
);

// GETTING PROPERTIES BY HOST EMAIL
router.get("/hostProperties/:email", verifyToken, gettingPropertiesByHostEmail);

// GETTING ALL THE CATEGORY OF PROPERTIES
router.get("/propertyCategories", gettingPropertyCategories);

// GETTING WISHLIST BY USER ID
router.get("/wishlist", verifyToken, gettingWishlistByUserId);

// GETTING RESERVATION LIST BY USER ID
router.get("/reservations", verifyToken, gettingReservationListByUserId);

// BLOCKING A PROPERTY
router.put("/block/:id", verifyToken, blockProperty);

// GETTING A PROPERTY DATA BY ID
router.get("/:id", verifyToken, gettingPropertyById);

export default router;
