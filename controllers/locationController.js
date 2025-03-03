const Location = require('../models/Location');
const Counter = require('../models/Counter');
const Business = require('../models/Business');
const User = require("../models/User");
// Create a new Location with unique location_id based on business_id
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
// Define storage FIRST

exports.createLocation = async (req, res) => {
  try {
    const { business_id, location_name, address_line_1, address_line_2, city, state, zipcode, schedule } = req.body;
    const authToken = req.headers["auth-token"];

    if (!authToken) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Invalid or expired auth-token.',
        data: null,
        errors: null,
      });
    }

    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = verified;
    const _id = req.user.userId;

    // Find the associated business by business_id
    const business = await Business.findById(business_id);

    if (!business) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Business not found.',
        data: null,
        errors: null,
      });
    }

    // Fetch the current counter for location_id (based on business_id)
    let counter = await Counter.findOne({ name: `location_id-${business_id}` });

    // If no counter exists for the business, create one
    if (!counter) {
      counter = new Counter({ name: `location_id-${business_id}`, count: 0 });
      await counter.save();
    }

    // Increment the counter
    counter.count += 1;
    await counter.save();

    // Generate location_id based on business_id (e.g., Business001-LOC001, Business001-LOC002)
    const location_id = `${business.business_id}-LOC${String(counter.count).padStart(3, '0')}`;

    // Create a new location with the generated location_id
    const newLocation = new Location({
      location_id,
      location_name,
      address_line_1,
      address_line_2,
      city,
      state,
      zipcode,
      business: business._id,
      schedule,
    });

    const savedLocation = await newLocation.save();

    const user = await User.findByIdAndUpdate(
      _id,
      { $set: { [`role.${savedLocation._id}`]: "owner" } },
      { new: true }
    );

    if (!user) {
      return res.status(403).json({
        status: 'error',
        code: 403,
        message: 'Unauthorized to update profile.',
        data: null,
        errors: null,
      });
    }

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Business location added successfully.',
      data: {
        location_id: savedLocation._id,
      },
      errors: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Error creating location.',
      data: null,
      errors: err.message,
    });
  }
};

exports.updatePayJunctionDetails = async (req, res) => { 
  try {
    const { location_id, webshop_id, api_user, api_password } = req.body;
    const authToken = req.headers["auth-token"];

    // Check for missing auth token
    if (!authToken) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Missing authentication token.",
        data: null,
        errors: null,
      });
    }

    // Verify token and extract user details
    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = verified;
    
    // Ensure location_id is provided
    if (!location_id || !webshop_id || !api_user || !api_password) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Missing required fields.",
        data: null,
        errors: null,
      });
    }

    // Find the location by location_id
    const location = await Location.findById(location_id);

    if (!location) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Location not found.",
        data: null,
        errors: null,
      });
    }

    // Update PayJunction details
    location.payjunction_details = {
      webshop_id,
      api_user,
      api_password,
    };

    await location.save();

    res.status(200).json({
      status: "success",
      code: 200,
      message: "PayJunction details added successfully.",
      data: null,
      errors: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error.",
      data: null,
      errors: err.message,
    });
  }
};

// Get all Locations for a Business
exports.getLocationsByBusiness = async (req, res) => {
  try {
    const authToken = req.headers["auth-token"];
          
              // Check for missing auth token
              if (!authToken) {
                return res.status(401).json({
                  status: "error",
                  code: 401,
                  message: "Missing authentication token.",
                  errors: null,
                });
              }
          
              // Verify token and extract user details
              const verified = jwt.verify(authToken, process.env.JWT_SECRET);
              req.user = verified;
    const locations = await Location.find({ business: req.params.businessId }).populate('business');

    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching locations', error: err.message });
  }
};

// Get Location by ID
exports.getLocationById = async (req, res) => {
  try {
    const authToken = req.headers["auth-token"];
          
              // Check for missing auth token
              if (!authToken) {
                return res.status(401).json({
                  status: "error",
                  code: 401,
                  message: "Missing authentication token.",
                  errors: null,
                });
              }
          
              // Verify token and extract user details
              const verified = jwt.verify(authToken, process.env.JWT_SECRET);
              req.user = verified;
    const location = await Location.findById(req.params.id).populate('business');

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching location', error: err.message });
  }
};

// Update Location by ID
exports.updateLocation = async (req, res) => {
  try {
    const authToken = req.headers["auth-token"];
          
              // Check for missing auth token
              if (!authToken) {
                return res.status(401).json({
                  status: "error",
                  code: 401,
                  message: "Missing authentication token.",
                  errors: null,
                });
              }
          
              // Verify token and extract user details
              const verified = jwt.verify(authToken, process.env.JWT_SECRET);
              req.user = verified;
    const { location_name, address_line_1, address_line_2, city, state, zipcode, schedule } = req.body;

    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      { location_name, address_line_1, address_line_2, city, state, zipcode, schedule },
      { new: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json(updatedLocation);
  } catch (err) {
    res.status(500).json({ message: 'Error updating location', error: err.message });
  }
};

// Delete Location by ID
exports.deleteLocation = async (req, res) => {
  try {
    const authToken = req.headers["auth-token"];
          
              // Check for missing auth token
              if (!authToken) {
                return res.status(401).json({
                  status: "error",
                  code: 401,
                  message: "Missing authentication token.",
                  errors: null,
                });
              }
          
              // Verify token and extract user details
              const verified = jwt.verify(authToken, process.env.JWT_SECRET);
              req.user = verified;
             // Check if the user role is "Owner"
    if (req.user.role !== "Owner") {
      return res.status(403).json({
        status: "error",
        code: 403,
        message: "Unauthorized. Only owners can delete locations.",
        errors: null,
      });
    }
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);

    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting location', error: err.message });
  }
};





// Define Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/logos/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, `${req.params.location_id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Multer file filter (only allow images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
}).single("logo");

// Upload Location Logo Controller
exports.uploadLogo  = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: err.message || "File upload error",
        errors: err,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "No file uploaded.",
        errors: null,
      });
    }

    try {
          const authToken = req.headers["auth-token"];
          
              // Check for missing auth token
              if (!authToken) {
                return res.status(401).json({
                  status: "error",
                  code: 401,
                  message: "Missing authentication token.",
                  errors: null,
                });
              }
          
              // Verify token and extract user details
              const verified = jwt.verify(authToken, process.env.JWT_SECRET);
              req.user = verified;
      const location = await Location.findOne({ location_id: req.params.location_id });

      if (!location) {
        return res.status(404).json({
          status: "error",
          code: 404,
          message: "Location not found.",
          errors: null,
        });
      }

      location.logo_url = `/uploads/logos/${req.file.filename}`;
      await location.save();

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Logo uploaded successfully.",
        data: { logo_url: location.logo_url },
        errors: null,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        code: 500,
        message: "Internal server error.",
        errors: error.message,
      });
    }
  });
};

// Update Customize App
exports.updateCustomizeApp = async (req, res) => {
  try {
        const authToken = req.headers["auth-token"];
        
            // Check for missing auth token
            if (!authToken) {
              return res.status(401).json({
                status: "error",
                code: 401,
                message: "Missing authentication token.",
                errors: null,
              });
            }
        
            // Verify token and extract user details
            const verified = jwt.verify(authToken, process.env.JWT_SECRET);
            req.user = verified;
    const { location_id } = req.params;
    const { primary_color, secondary_color, font_color } = req.body;

    if (!primary_color || !secondary_color || !font_color) {
      return res.status(400).json({ status: "error", code: 400, message: "All fields are required.", errors: null });
    }

    const location = await Location.findById(location_id );

    if (!location) {
      return res.status(404).json({ status: "error", code: 404, message: "Location not found.", errors: null });
    }

    location.customize_app = { primary_color, secondary_color, font_color };
    await location.save();

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Customer app customization updated successfully.",
      data: null,
      errors: null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Error updating customize app.", errors: error.message });
  }
};

// Update Schedule
exports.updateSchedule = async (req, res) => {
  try {
        const authToken = req.headers["auth-token"];
        
            // Check for missing auth token
            if (!authToken) {
              return res.status(401).json({
                status: "error",
                code: 401,
                message: "Missing authentication token.",
                errors: null,
              });
            }
        
            // Verify token and extract user details
            const verified = jwt.verify(authToken, process.env.JWT_SECRET);
            req.user = verified;
    const { location_id } = req.params;
    const schedule = req.body;

    if (!Array.isArray(schedule) || schedule.length === 0) {
      return res.status(400).json({ status: "error", code: 400, message: "Schedule data is required.", errors: null });
    }

    const location = await Location.findById(location_id);

    if (!location) {
      return res.status(404).json({ status: "error", code: 404, message: "Location not found.", errors: null });
    }

    location.schedule = schedule;
    await location.save();

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Location schedule updated successfully.",
      data: null,
      errors: null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", code: 500, message: "Error updating schedule.", errors: error.message });
  }
};



// GET location by location_id
exports.alldetailsByLocationId = async (req, res) => {
  try {
    const authToken = req.headers["auth-token"];
        
    // Check for missing auth token
    if (!authToken) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Missing authentication token.",
        errors: null,
      });
    }

    // Verify token and extract user details
    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = verified;
    const { location_id } = req.params;

    const location = await Location.findById(location_id).populate("hubs");

    if (!location) {
      return res.status(404).json({
        "status": "error",
        "code": 404,
        "message": "Location not found.",
        "data": null,
        "errors": null
      });
    }

    res.status(200).json({
      "status": "success",
      "code": 200,
      "message": "Location info fetched successfully.",
      "data": {
        "location_id": location.location_id,
        "location_name": location.location_name,
        "address_line_1": location.address_line_1,
        "address_line_2": location.address_line_2,
        "city": location.city,
        "state": location.state,
        "zipcode": location.zipcode,
        "logo_url": location.logo_url,
        "schedule": location.schedule,
        "customize_app": location.customize_app,
        "pay_junction": location.payjunction_details
      },
      "errors": null
    });
  } catch (error) {
    res.status(500).json({
      "status": "error",
      "code": 500,
      "message": "Server error.",
      "data": null,
      "errors": error.message
    });
  }
};


// PUT update location by location_id
exports.updateAlldetailsByLocationId = async (req, res) => {
  try {
    const authToken = req.headers["auth-token"];
        
    // Check for missing auth token
    if (!authToken) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Missing authentication token.",
        errors: null,
      });
    }

    // Verify token and extract user details
    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = verified;
    const { location_id } = req.params;
    const updateData = req.body;

    const updatedLocation = await Location.findByIdAndUpdate(
       location_id ,  // Find location by location_id
      updateData,
      { new: true, runValidators: true } // Return updated document & apply validation
    );

    if (!updatedLocation) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Location not found.",
        data: null,
        errors: null
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Location updated successfully.",
      data: {
        location_id: updatedLocation.location_id,
        location_name: updatedLocation.location_name,
        address_line_1: updatedLocation.address_line_1,
        address_line_2: updatedLocation.address_line_2,
        city: updatedLocation.city,
        state: updatedLocation.state,
        zipcode: updatedLocation.zipcode,
        business: updatedLocation.business,  // Keeping business reference
        payjunction_details: updatedLocation.payjunction_details,
        logo_url: updatedLocation.logo_url,
        schedule: updatedLocation.schedule,
        customize_app: updatedLocation.customize_app
      },
      errors: null
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Server error.",
      data: null,
      errors: error.message
    });
  }
};



