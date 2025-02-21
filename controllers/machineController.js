const Machine = require("../models/Machine"); // Assuming the model is located in the models folder
const Hub = require("../models/Hub"); // Assuming the model is located in the models folder
const Counter = require('../models/Counter');
const jwt = require("jsonwebtoken");
// Create a new Machine
exports.createMachine = async (req, res) => {
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

    const { hub_id, port_position, name, mode, price, pulses_per_second, enabled } = req.body;

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

    // Find or create machine ID counter
    let counter = await Counter.findOne({ name: "machine_id" });

    if (!counter) {
      counter = new Counter({ name: "machine_id", count: 0 });
      await counter.save();
    }

    // Increment the counter
    counter.count += 1;
    await counter.save();

    // Generate machine_id (e.g., "Machine001", "Machine002")
    const machine_id = `machine_${String(counter.count).padStart(3, "0")}`;

    // Create a new machine entry
    const newMachine = new Machine({
      machine_id,
      hub: hub._id, // Use the ObjectId of the hub
      port_position,
      name,
      mode,
      price,
      pulses_per_second,
      enabled,
    });

    const savedMachine = await newMachine.save();

    // Send response with expected format
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Machine added to hub successfully.",
      data: {
        machine_id: savedMachine._id,
      },
      errors: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Error creating machine.",
      errors: err.message,
    });
  }
};


// Get all Machines
exports.getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.find().populate("hub");
    res.status(200).json(machines);
  } catch (err) {
    res.status(500).json({ message: "Error fetching machines", error: err.message });
  }
};

// Get Machine by ID
exports.getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id).populate("hub");

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    res.status(200).json(machine);
  } catch (err) {
    res.status(500).json({ message: "Error fetching machine", error: err.message });
  }
};
 // Adjust the path based on your project structure

 exports.getAllMachinesByHubId = async (req, res) => {
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

    const { hub_id } = req.params; // Extract hub_id from URL params

    // Find all machines that belong to the given hub_id
    const machines = await Machine.find({ hub: hub_id });

    if (!machines || machines.length === 0) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "No machines found for the given hub.",
        errors: null,
      });
    }

    // Format response data
    const formattedMachines = machines.map(machine => ({
      machine_id: machine._id,
      port_position: machine.port_position,
      name: machine.name,
      mode: machine.mode,
      price: machine.price,
      pulses_per_second: machine.pulses_per_second,
      enabled: machine.enabled,
    }));

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Machines fetched successfully.",
      data: {
        machines: formattedMachines,
      },
      errors: null,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Error retrieving machines.",
      errors: err.message,
    });
  }
};



// Update Machine by ID
exports.updateMachine = async (req, res) => { 
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

    const { hub_id, port_position, name, mode, price, pulses_per_second, enabled } = req.body;

    // Find the hub by hub_id
    const hub = await Hub.findById(hub_id);
    if (!hub) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Hub not found",
        errors: null,
      });
    }

    // Update the machine
    const updatedMachine = await Machine.findByIdAndUpdate(
      req.params.id,
      { hub: hub._id, port_position, name, mode, price, pulses_per_second, enabled },
      { new: true }
    ).populate("hub");

    if (!updatedMachine) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Machine not found",
        errors: null,
      });
    }

    // Respond with the required structure
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Machine updated on hub successfully.",
      data: {
        machine_id: updatedMachine._id,
      },
      errors: null,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Error updating machine",
      errors: err.message,
    });
  }
};


// Delete Machine by ID
exports.deleteMachine = async (req, res) => {
  try {
    const deletedMachine = await Machine.findByIdAndDelete(req.params.id);

    if (!deletedMachine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    res.status(200).json({ message: "Machine deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting machine", error: err.message });
  }
};
