const Hub = require("../models/Hub"); // Assuming your Hub model is in the models folder
const Business = require("../models/Business");
const Location = require("../models/Location");
const Sequence = require("../models/Sequence");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateHubId = async () => {
  try {
    // Find the last sequence entry (sorted by counter in descending order)
    let lastSequence = await Sequence.findOne().sort({ counter: -1 });

    // If no sequence exists, start from 1
    let nextCounter = lastSequence ? lastSequence.counter + 1 : 1;

    // Create a new sequence entry for tracking (optional, depends on use case)
    await Sequence.create({ counter: nextCounter });

    // Generate the hub ID in the format HUB_001, HUB_002, etc.
    const hubId = `HUB_${nextCounter.toString().padStart(3, '0')}`;
    return hubId;
  } catch (err) {
    console.error("Error generating Hub ID:", err);
    throw new Error("Error generating Hub ID");
  }
};
// Create a new Hub
exports.createHub = async (req, res) => {
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
        
    const { business_id, location_id, mac_address, serial_number, ports } = req.body;

    // Find the business by business_id
    const business = await Business.findById(business_id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find the location by location_id within the specified business
    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Generate the unique hub_id
    const hubId = await generateHubId();

    // Create a new Hub
    const newHub = new Hub({
      hub_id: hubId,  // Assign the generated hub_id
      location: location_id,
      business: business_id,
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
// Adjust the path based on your project structure

// Adjust the path based on your project structure

exports.addOrUpdatePortsToHub = async (req, res) => {
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
    const { hub_id } = req.params; // Extract hub_id from URL
    const { ports } = req.body; // Extract ports array from request body

    // Validate input
    if (!ports || !Array.isArray(ports) || ports.length === 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Invalid or missing ports data.",
        errors: null,
      });
    }

    // Find the hub by hub_id
    const hub = await Hub.findById(hub_id);

    if (!hub) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Hub not found.",
        errors: null,
      });
    }

    // Convert existing ports to a Map for quick lookup
    const existingPortsMap = new Map(hub.ports.map(port => [port.position, port]));

    // Process ports: update existing ones, add new ones
    ports.forEach(newPort => {
      if (
        typeof newPort.position !== "number" ||
        !["connected", "not_connected"].includes(newPort.status) ||
        typeof newPort.timestamp !== "number"
      ) {
        return; // Skip invalid ports
      }

      if (existingPortsMap.has(newPort.position)) {
        // If port exists, update status and timestamp
        existingPortsMap.get(newPort.position).status = newPort.status;
        existingPortsMap.get(newPort.position).timestamp = newPort.timestamp;
      } else {
        // If port doesn't exist, add a new one
        hub.ports.push({
          position: newPort.position,
          status: newPort.status,
          timestamp: newPort.timestamp,
        });
      }
    });

    // Save the updated hub document
    await hub.save();

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Ports added or updated successfully.",
      data: hub.ports,
      errors: null,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Error updating ports in hub.",
      errors: err.message,
    });
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
exports.updateHubName = async (req, res) => {
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
    const { business_id, location_id, hub_id, hub_name } = req.body;

    // Find the business by business_id
    const business = await Business.findById(business_id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Find the location by location_id within the specified business
    const location = await Location.findById(location_id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Update the hub using the found business and location
    const updatedHub = await Hub.findByIdAndUpdate(
      hub_id,
      {hub_name:hub_name},
      { new: true }
    ).populate("location").populate("business").populate("ports");

    if (!updatedHub) {
      return res.status(404).json({ message: "Hub not found" });
    }

    res.status(201).json({
      status: "success",
      code: 201,
       message: "Hub renamed successfully.",
      data: {
        hub_id: updatedHub._id,
        hub_name: updatedHub.hub_name,
      },
      errors: null,
    });
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
