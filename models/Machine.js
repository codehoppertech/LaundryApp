
const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  hubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', required: true },
  portId: { type: mongoose.Schema.Types.ObjectId, ref: 'Port', required: true },
  machine_name: { type: String, required: true },
  mode: { type: String, required: true, enum: ['washer', 'drier'] },
  price: { type: Number, required: true },
  pulses_per_second: { type: Number, required: true },
  port_enabled: { type: Boolean, required: true },
  machine_id: { type: mongoose.Schema.Types.ObjectId, unique: true, default: () => new mongoose.Types.ObjectId() }
});

module.exports = mongoose.model('Machine', machineSchema);
