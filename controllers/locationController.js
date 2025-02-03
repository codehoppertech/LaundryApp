const Location = require('../models/Location');
const Counter = require('../models/Counter');
const Business = require('../models/Business');

// Create a new Location with unique location_id based on business_id
exports.createLocation = async (req, res) => {
  try {
    const { business_id, location_name, address_line_1, address_line_2, city, state, zipcode, schedule } = req.body;

    // Find the associated business by business_id
    const business = await Business.findOne({ business_id });

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
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
      location_id,   // Generated location_id
      location_name,
      address_line_1,
      address_line_2,
      city,
      state,
      zipcode,
      business: business._id,  // Reference to the business
      schedule,
    });

    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (err) {
    res.status(500).json({ message: 'Error creating location', error: err.message });
  }
};

// Get all Locations for a Business
exports.getLocationsByBusiness = async (req, res) => {
  try {
    const locations = await Location.find({ business: req.params.businessId }).populate('business');

    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching locations', error: err.message });
  }
};

// Get Location by ID
exports.getLocationById = async (req, res) => {
  try {
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
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);

    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting location', error: err.message });
  }
};
