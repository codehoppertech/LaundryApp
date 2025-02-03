const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: {
    type: String,
    required: true,
    enum: ["Technician", "Admin", "Internal Staff", "External Staff","Business Owner"],
  },
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" }, // Reference to Business
  location_permissions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Location" }, // Array of Locations the user can access
  ],
  password: { type: String }, // For authentication (if required)
  invitation_token: { type: String }, // For role invitation
  accepted_role: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
