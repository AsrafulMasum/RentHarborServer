const Properties = require("../models/Properties");

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
    const property = await Properties.findById(propertyId);
    res.status(200).json({ property });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
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
    });

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

module.exports = {
  addingProperty,
  gettingAllProperties,
  gettingPropertyById,
  gettingPropertiesByHostEmail,
  gettingPropertyCategories,
};
