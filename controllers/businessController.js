const Business = require('../models/Business');
const Counter = require('../models/Counter');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Create a new Business with unique business_id
exports.createBusiness = async (req, res) => {
  try {
    const authToken = req.headers["auth-token"];
    
    if (!authToken) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Invalid or expired auth-token.",
        errors: null,
      });
    }

    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = verified;
    const _id = req.user.userId;
    const { business_name } = req.body;

    // Fetch the current counter for business_id
    let counter = await Counter.findOne({ name: "business_id" });
    
    if (!counter) {
      counter = new Counter({ name: "business_id", count: 0 });
      await counter.save();
    }

    // Increment the counter
    counter.count += 1;
    await counter.save();

    // Generate business_id based on counter (Business001, Business002, etc.)
    const business_id = `Business${String(counter.count).padStart(3, "0")}`;

    // Create a new business with the generated business_id
    const newBusiness = new Business({
      business_name,
      business_id,
    });

    const savedBusiness = await newBusiness.save();
    
    res.status(201).json({
      status: "success",
      code: 201,
      message: "Business created successfully.",
      data: {
        business_id: savedBusiness._id,
        business_name: savedBusiness.business_name,
      },
      errors: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Error creating business.",
      errors: err.message,
    });
  }
};


// Get all Businesses
exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching businesses', error: err.message });
  }
};

// Get Business by ID
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json(business);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching business', error: err.message });
  }
};

// Update Business by ID
exports.updateBusiness = async (req, res) => {
  try {
    const { business_name } = req.body;

    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      { business_name },
      { new: true }
    );

    if (!updatedBusiness) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json(updatedBusiness);
  } catch (err) {
    res.status(500).json({ message: 'Error updating business', error: err.message });
  }
};

// Delete Business by ID
exports.deleteBusiness = async (req, res) => {
  try {
    const deletedBusiness = await Business.findByIdAndDelete(req.params.id);

    if (!deletedBusiness) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting business', error: err.message });
  }
};
