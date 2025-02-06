const Role = require("../models/Role");
const Location = require("../models/Location"); // assuming Location model
const Business = require("../models/Business"); // assuming Business model

// Create role with optional location and business validation
exports.createRole = async (req, res) => {
  try {
      const { email, location_id, business_id, assignedRoles } = req.body;

      // Validate if location_id and business_id exist (optional)
      let location = null;
      let business = null;

      if (location_id) {  
        location = await Location.findOne({location_id});
        if (!location) {
          return res.status(400).json({ message: "Invalid location ID" });
        }
      }

      if (business_id) {
         business = await Business.findOne({ business_id });
        if (!business) {
          return res.status(400).json({ message: "Invalid business ID" });
        }
      }

      // Create the role
      const role = await Role.create({
        email,
        location_id,
        business_id,
        location: location ? location._id : undefined,
        business: business ? business._id : undefined,
        assignedRoles
      });

      res.status(201).json({ message: "Role created successfully", role });
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ message: "Internal server error" });
    }
}

// Update role with optional location and business validation
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if location_id and business_id are provided in the update (optional)
    if (updates.location_id) {
      const location = await Location.findById(updates.location_id);
      if (!location) {
        return res.status(400).json({ message: "Invalid location ID" });
      }
      updates.location = location._id;
    }

    if (updates.business_id) {
      const business = await Business.findById(updates.business_id);
      if (!business) {
        return res.status(400).json({ message: "Invalid business ID" });
      }
      updates.business = business._id;
    }

    // Find and update the role
    const role = await Role.findByIdAndUpdate(id, updates, { new: true });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role updated successfully", role });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all roles by email
exports.getRolesByEmail = async (req, res) => {
    try {
      const { email } = req.params;
  console.log("email",email);
  console.log("req.params",req.params);
      // Find all roles by email
      //const roles = await Role.find({ email }).populate('location business'); // Populate the location and business fields
      const roles = await Role.find({ email });
      if (roles.length === 0) {
        return res.status(404).json({ message: "No roles found for this email" });
      }
  
      res.status(200).json({ message: "Roles found", roles });
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  