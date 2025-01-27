

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  location_name: { type: String, required: true },
  address_line_1: { type: String, required: true },
  address_line_2: { type: String },
  address_line_3: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true, match: /^[0-9]{5}$/ },
  logo_url: { type: String },
  schedule: [{
    day: { type: String, required: true },
    open: { type: Boolean, required: true },
    open_time: { type: String },
    close_time: { type: String }
  }],
  customize_app: {
    primary_color: { type: String },
    secondary_color: { type: String },
    font_color: { type: String }
  },
  location_id: { type: mongoose.Schema.Types.ObjectId, unique: true, default: () => new mongoose.Types.ObjectId() }
});

module.exports = mongoose.model('Location', locationSchema);
