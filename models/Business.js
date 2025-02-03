const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  business_id: { type: String, unique: true }, // Ensure uniqueness in MongoDB
  business_name: { type: String, required: true },
});

module.exports = mongoose.model("Business", businessSchema);
