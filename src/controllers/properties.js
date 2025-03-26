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

    // Return a success response
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
    const properties = await Properties.find();
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

module.exports = {
  addingProperty,
  gettingAllProperties,
  gettingPropertyById,
};
