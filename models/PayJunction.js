const mongoose = require('mongoose');
  // models/PayJunction.js
const payJunctionSchema = new mongoose.Schema({
  business_id: { type:String, ref: 'Business', required: true },
  webshop_id: { type: String, required: true },
  api_user: { type: String, required: true },
  api_password: { type: String, required: true }
});

module.exports = mongoose.model('PayJunction', payJunctionSchema);