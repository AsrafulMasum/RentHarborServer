const Properties = require("../models/Properties");
const Reservation = require("../models/Reservation");

const addingProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    const address = {
      street: propertyData?.street,
      city: propertyData?.city,
      state: propertyData?.state,
      zip: propertyData?.zip,
      latitude: propertyData?.latitude,
      longitude: propertyData?.longitude,
    };

    const newProperty = new Properties({
      title: propertyData?.title,
      description: propertyData?.description,
      images: propertyData?.propertyPhoto,
      pricePerDay: propertyData?.price,
      location: propertyData?.location,
      squareFeet: propertyData?.squareFeet,
      category: propertyData?.category,
      bedrooms: propertyData?.bedrooms,
      bathrooms: propertyData?.bathrooms,
      masterRoom: propertyData?.masterRoom,
      childRoom: propertyData?.childRoom,
      amenities: propertyData?.amenities,
      numberOfBalconies: propertyData?.numberOfBalconies,
      kitchen: propertyData?.kitchen,
      features: propertyData?.features,
      host: propertyData?.host,
      address: address,
      availableDates: propertyData?.availableDates,
    });
    const result = await newProperty.save();

    res.status(201).json({
      result,
      success: true,
    });
  } catch (error) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const gettingAllProperties = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = search.trim()
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { amenities: { $regex: search, $options: "i" } },
            { features: { $regex: search, $options: "i" } },
            { "address.street": { $regex: search, $options: "i" } },
            { "address.city": { $regex: search, $options: "i" } },
            { "address.state": { $regex: search, $options: "i" } },
            { "address.zip": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const properties = await Properties.find(query).sort({ createdAt: -1 });

    res.status(200).json({ properties });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const gettingPropertyById = async (req, res) => {
  try {
    const propertyId = req.params.id;

    if (!propertyId || propertyId === "undefined") {
      return res
        .status(400)
        .json({ success: false, message: "Property ID is required" });
    }

    // 1. Find the property
    const property = await Properties.findById(propertyId);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // 2. Find all reservations for this property
    const reservations = await Reservation.find({ propertyId });

    // 3. Expand all reservation ranges into dates
    let reservedDates = [];
    reservations.forEach((res) => {
      let current = new Date(res.startDate);
      let end = new Date(res.endDate);

      while (current <= end) {
        reservedDates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    res.status(200).json({
      success: true,
      property,
      reservedDates, // <-- add reserved dates here
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const gettingPropertiesByHostEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const result = await Properties.find({
      "host.email": email,
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const gettingPropertyCategories = async (req, res) => {
  try {
    const categories = await Properties.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

const gettingWishlistByUserId = async (req, res) => {
  const user = req.decoded;
  try {
    if (
      !user?.wishList ||
      !Array.isArray(user.wishList) ||
      user.wishList.length === 0
    ) {
      return res.status(200).json([]);
    }
    const properties = await Properties.find({ _id: { $in: user.wishList } });
    res.status(200).json({ success: true, properties });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const gettingReservationListByUserId = async (req, res) => {
  const user = req.decoded;

  try {
    if (
      !user?.reservationList ||
      !Array.isArray(user.reservationList) ||
      user.reservationList.length === 0
    ) {
      return res.status(200).json({ success: true, properties: [] });
    }

    // Extract propertyIds
    const propertyIds = user.reservationList.map((r) => r.propertyId);

    // Get property details
    const properties = await Properties.find({
      _id: { $in: propertyIds },
    });

    // Attach reservation info (startDate, endDate) with property
    const reservationsWithDetails = user.reservationList.map((reservation) => {
      const property = properties.find(
        (p) => p._id.toString() === reservation.propertyId.toString()
      );
      return {
        ...reservation,
        property,
      };
    });

    res
      .status(200)
      .json({ success: true, reservations: reservationsWithDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addingProperty,
  gettingAllProperties,
  gettingPropertyById,
  gettingPropertiesByHostEmail,
  gettingPropertyCategories,
  gettingWishlistByUserId,
  gettingReservationListByUserId,
};
