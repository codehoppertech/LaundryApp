const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  locationName: { type: String, required: true },
  address: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true, match: /^[0-9]{5}$/ },
  },
});

module.exports = mongoose.model("Location", LocationSchema);
