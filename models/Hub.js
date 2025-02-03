const mongoose = require("mongoose");

const hubSchema = new mongoose.Schema({
  hub_id: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true // Ensure the hub_id is indexed for fast lookups
  },
  location: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Location", 
    required: true 
  }, // Reference to Location
  business: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Business", 
    required: true 
  }, // Reference to Business
  mac_address: {
    type: String,
    required: true,
    unique: true,
    match: /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, // Validate MAC address format
  },
  serial_number: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Serial number must be unique
  ports: [
    {
      port_position: { type: String }, // Port position (e.g., 1, 2, 3)
      machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" }, // Reference to Machine
    },
  ],
});
module.exports = mongoose.model("Hub", hubSchema);
// module.exports = mongoose.model("Hub", hubSchema);
// {
//   "_id": "60d9f0a3e3d3034b3c925647",
//   "hub_id": "HUB_001",
//   "location": "60d9f0a3e3d3034b3c925645",
//   "business": "60d9f0a3e3d3034b3c925644",
//   "mac_address": "00:1A:2B:3C:4D:5E",
//   "serial_number": "SN123456",
//   "ports": [
//     { "port_position": "1", "machine": "Machine001" }
//   ]
// }
