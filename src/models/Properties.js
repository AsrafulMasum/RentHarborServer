const mongoose = require("mongoose");

const PropertiesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      default: {},
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    squareFeet: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    masterRoom: {
      type: Number,
      required: true,
    },
    childRoom: {
      type: Number,
      required: true,
    },
    amenities: {
      type: Array,
      default: [],
    },
    numberOfBalconies: {
      type: Number,
      required: true,
    },
    kitchen: {
      type: Number,
      required: true,
    },
    features: {
      type: Array,
      default: [],
    },
    host: {
      type: Object,
      default: {},
      required: true,
    },
    images: {
      type: Array,
      default: [],
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    availableDates: {
      type: Object,
      default: {},
      required: true,
    },
  },
  { timestamps: true }
);

const Properties = mongoose.model("Properties", PropertiesSchema);
module.exports = Properties;
