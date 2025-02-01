const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
  hubId: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", required: true },
  portPosition: { type: Number },
  name: { type: String, required: true },
  mode: { type: String, enum: ["washer", "dryer", "combo"], required: true },
  price: { type: Number, required: true },
  pulsesPerSecond: { type: Number, required: true },
  enabled: { type: Boolean, default: true },
});

module.exports = mongoose.model("Machine", MachineSchema);
