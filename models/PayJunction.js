const mongoose = require("mongoose");

const PayJunctionSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  webshopId: { type: String, required: true },
  apiUser: { type: String, required: true },
  apiPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PayJunction", PayJunctionSchema);
