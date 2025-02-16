const mongoose = require("mongoose");

const hubSchema = new mongoose.Schema({
  hub_id: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true // Ensure fast lookups
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
  hub_name: {
    type: String,
    unique: true,
  },
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
      position: { type: Number }, // Port position (1, 2, etc.)
      status: { type: String, enum: ["connected", "not_connected"]}, // Ensures only valid statuses
      timestamp: { type: Number }// Unix timestamp

    },
  ],
});

module.exports = mongoose.model("Hub", hubSchema);
