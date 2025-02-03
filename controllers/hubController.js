const Hub = require("../models/Hub"); // Assuming your Hub model is in the models folder
const Business = require("../models/Business");
const Location = require("../models/Location");
const Sequence = require("../models/Sequence");

const generateHubId = async (businessId, locationId) => {
  try {
    // Find or create the sequence for the given business and location
    let sequence = await Sequence.findOne({ business_id: businessId, location_id: locationId });
    
    if (!sequence) {
      sequence = new Sequence({
        business_id: businessId,
        location_id: locationId,
        counter: 0, // Start the counter at 0
      });
      await sequence.save();
    }

    // Increment the counter
    sequence.counter += 1;
    await sequence.save();

    // Generate the hub ID in the format HUB_001, HUB_002, etc.
    const hubId = `HUB_${(sequence.counter).toString().padStart(3, '0')}`;
    return hubId;
  } catch (err) {
    console.error("Error generating Hub ID:", err);
    throw new Error("Error generating Hub ID");
  }
};

    
// Create a new Hub
exports.createHub = async (req, res) => {
  try {
    const { business_id, location_id, mac_address, serial_number, ports } = req.body;

    // Find the business by business_id
    const business = await Business.findOne({ business_id });
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find the location by location_id within the specified business
    const location = await Location.findOne({ location_id, business: business._id });
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Generate the unique hub_id
    const hubId = await generateHubId(business._id, location._id);

    // Create a new Hub
    const newHub = new Hub({
      hub_id: hubId,  // Assign the generated hub_id
      location: location._id,
      business: business._id,
      mac_address,
      serial_number,
      ports,
    });

    // Save the new hub to the database
    const savedHub = await newHub.save();
    res.status(201).json({ status: "success", data: savedHub });
  } catch (err) {
    res.status(500).json({ message: "Error creating hub", error: err.message });
  }
};

// Get all Hubs
exports.getAllHubs = async (req, res) => {
  try {
    const hubs = await Hub.find()
      .populate("location")
      .populate("business")
      .populate("ports.machine");

    res.status(200).json(hubs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hubs", error: err.message });
  }
};

// Get Hub by ID
exports.getHubById = async (req, res) => {
  try {
    const hub = await Hub.findById(req.params.id)
      .populate("location")
      .populate("business")
      .populate("ports.machine");

    if (!hub) {
      return res.status(404).json({ message: "Hub not found" });
    }

    res.status(200).json(hub);
  } catch (err) {
    res.status(500).json({ message: "Error fetching hub", error: err.message });
  }
};

// Update Hub by ID
exports.updateHub = async (req, res) => {
  try {
    const { business_id, location_id, mac_address, serial_number, ports } = req.body;

    // Find the business by business_id
    const business = await Business.findOne({ business_id });
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find the location by location_id within the specified business
    const location = await Location.findOne({ location_id, business: business._id });
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Generate the unique hub_id (if it's not already set)
    const hubId = await generateHubId(business._id, location._id);

    // Update the hub using the found business and location
    const updatedHub = await Hub.findByIdAndUpdate(
      req.params.id,
      { hub_id: hubId, location: location._id, business: business._id, mac_address, serial_number, ports },
      { new: true }
    ).populate("location").populate("business").populate("ports.machine");

    if (!updatedHub) {
      return res.status(404).json({ message: "Hub not found" });
    }

    res.status(200).json(updatedHub);
  } catch (err) {
    res.status(500).json({ message: "Error updating hub", error: err.message });
  }
};

// Delete Hub by ID
exports.deleteHub = async (req, res) => {
  try {
    const deletedHub = await Hub.findByIdAndDelete(req.params.id);

    if (!deletedHub) {
      return res.status(404).json({ message: "Hub not found" });
    }

    res.status(200).json({ message: "Hub deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting hub", error: err.message });
  }
};
