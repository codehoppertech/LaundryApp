const mongoose = require("mongoose");

const HubSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  macAddress: { type: String, required: true, unique: true },
  serialNumber: { type: String, required: true },
});

module.exports = mongoose.model("Hub", HubSchema);
