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
  }, 
  business: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Business", 
    required: true 
  },
  hub_name: {
    type: String,
  },
  mac_address: {
    type: String,
    required: false, // Make it optional
    match: /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, // Validate MAC address format
  },
  serial_number: { 
    type: String, 
  },
  ports: [
    {
      position: { type: Number },
      status: { type: String, enum: ["connected", "not_connected"]}, 
      timestamp: { type: Number }
    },
  ],
});

// Create partial indexes to enforce uniqueness only when the value is not null
hubSchema.index({ hub_name: 1 }, { unique: true, partialFilterExpression: { hub_name: { $ne: null } } });
hubSchema.index({ mac_address: 1 }, { unique: true, partialFilterExpression: { mac_address: { $ne: null } } });
hubSchema.index({ serial_number: 1 }, { unique: true, partialFilterExpression: { serial_number: { $ne: null } } });

module.exports = mongoose.model("Hub", hubSchema);
