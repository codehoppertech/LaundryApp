// const mongoose = require('mongoose');

// const portSchema = new mongoose.Schema({
//   hub_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', required: true },
//   business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
//   name: { type: String, required: true },
//   status: { type: String, enum: ['active', 'inactive'], default: 'active' },
//   machine: {
//     machine_id: { type: mongoose.Schema.Types.ObjectId },
//     name: { type: String },
//     assigned_at: { type: Date },
//   },
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Port', portSchema);

const mongoose = require('mongoose');

const portSchema = new mongoose.Schema({
  hub_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', required: true },
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  machine: {
    machine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' },
    name: { type: String },
    assigned_at: { type: Date },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  port_id: { type: mongoose.Schema.Types.ObjectId, unique: true, default: () => new mongoose.Types.ObjectId() }
});

module.exports = mongoose.model('Port', portSchema);
