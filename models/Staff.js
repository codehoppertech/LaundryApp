const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  business_id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['Technician', 'Admin', 'Internal Staff', 'External Staff'] },
  location_permissions: [{ type: String }],
  status: { type: String, default: 'pending' },
  invitationToken: { type: String },
});

module.exports = mongoose.model('Staff', userSchema);