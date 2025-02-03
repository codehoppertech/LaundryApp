const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  location_id: { type: String, unique: true },  // Unique location_id based on business_id
  location_name: { type: String, required: true },
  address_line_1: { type: String, required: true },
  address_line_2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true, match: /^[0-9]{5}$/ },
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },  // Reference to Business
  hubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hub" }],  // Array of associated Hubs
  payjunction_details: {
    webshop_id: { type: String },
    api_user: { type: String },
    api_password: { type: String },
  },
  logo_url: { type: String },
  schedule: [
    {
      day: { type: String, required: true },
      open: { type: Boolean, required: true },
      open_time: { type: String },
      close_time: { type: String },
    },
  ],
  customize_app: {
    primary_color: { type: String },
    secondary_color: { type: String },
    font_color: { type: String },
  },
});

module.exports = mongoose.model("Location", locationSchema);
