const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  hub: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", required: true }, // Reference to Hub
  port_position: { type: String, required: true }, // Port position
  name: { type: String, required: true }, // Machine name
  mode: {
    type: String,
    required: true,
    enum: ["washer", "drier", "combo"], // Enum for machine mode
  },
  price: { type: Number, required: true }, // Price in USD
  pulses_per_second: { type: Number, required: true }, // Pulses per second
  enabled: { type: Boolean, required: true }, // Is the machine enabled or not
});

module.exports = mongoose.model("Machine", machineSchema);
