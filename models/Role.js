const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: false, // Optional field
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: false, // Optional field
    },
    location_id: {
      type: String,
      trim: true,
      required: false, // Optional field
    },
    business_id: {
      type: String,
      trim: true,
      required: false, // Optional field
    },
    assignedRoles: [
      {
        type: String,
        enum: [
          "Technician",
          "Admin",
          "Internal Staff",
          "External Staff",
          "Business Owner",
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Role", roleSchema);
