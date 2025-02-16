const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
  counter: { type: Number, default: 0 }
});

module.exports = mongoose.model('Sequence', sequenceSchema);
