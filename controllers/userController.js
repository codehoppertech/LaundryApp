const User = require("../models/User"); // Assuming your User model is in the models folder
const Business = require("../models/Business");
const Location = require("../models/Location");

// Create a new User
exports.createUser = async (req, res) => {
  try {
    const { business_id, location_id, name, email, role, location_permissions, password, invitation_token } = req.body;

    // Find the business by business_id
    const business = await Business.findOne({ business_id });
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find the location by location_id
    const location = await Location.findOne({ location_id });
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Create the new user with the found business and location
    const newUser = new User({
      name,
      email,
      role,
      business: business._id,
      location_permissions: location._id,
      password,
      invitation_token,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

// Get all Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("business")
      .populate("location_permissions");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("business")
      .populate("location_permissions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

// Update User by ID
exports.updateUser = async (req, res) => {
  try {
    const { business_id, location_id, name, email, role, location_permissions, password, invitation_token, accepted_role } = req.body;

    // Find the business by business_id
    const business = await Business.findOne({ business_id });
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find the location by location_id
    const location = await Location.findOne({ location_id });
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Update the user with the found business and location
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, business: business._id, location_permissions: location._id, password, invitation_token, accepted_role },
      { new: true }
    )
      .populate("business")
      .populate("location_permissions");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

// Delete User by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};
