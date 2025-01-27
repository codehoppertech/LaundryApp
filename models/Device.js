const mongoose = require('mongoose');
const deviceSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  mac_address: { type: String, required: true, match: /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/ },
  serial_number: { type: String, required: true }
});

module.exports = mongoose.model('Device', deviceSchema);