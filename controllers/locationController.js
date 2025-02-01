const Location = require("../models/Location");

exports.addLocation = async (req, res) => {
  try {
    const { businessId, locationName, address } = req.body;
    const location = new Location({ businessId, locationName, address });
    await location.save();
    res.status(201).json({ message: "Location added successfully", locationId: location._id });
  } catch (error) {
    res.status(500).json({ message: "Error adding location." });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ businessId: req.params.businessId });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations." });
  }
};
