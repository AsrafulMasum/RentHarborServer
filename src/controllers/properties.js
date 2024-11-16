const Properties = require("../models/Properties");

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
  gettingAllProperties,
  gettingPropertyById,
};
