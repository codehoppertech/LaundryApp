const mongoose = require('mongoose');
const HubSchema = new mongoose.Schema({
    business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    hub_status: { type: String, enum: ['connect', 'purchase'], required: true },
    devices: [{
      mac_address: { type: String, required: true },
      serial_number: { type: String, required: true },
    }],
  });
  module.exports = mongoose.model('Hub', HubSchema);
  