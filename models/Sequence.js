const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  counter: { type: Number, default: 0 }
});

module.exports = mongoose.model('Sequence', sequenceSchema);
