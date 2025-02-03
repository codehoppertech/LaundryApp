const Machine = require("../models/Machine"); // Assuming the model is located in the models folder
const Hub = require("../models/Hub"); // Assuming the model is located in the models folder

// Create a new Machine
exports.createMachine = async (req, res) => {
  try {
    const { hub_id, port_position, name, mode, price, pulses_per_second, enabled } = req.body;

    // Find the hub by hub_id
    const hub = await Hub.findOne({ hub_id });
    if (!hub) {
      return res.status(404).json({ message: "Hub not found" });
    }

    const newMachine = new Machine({
      hub: hub._id, // Use the ObjectId of the hub
      port_position,
      name,
      mode,
      price,
      pulses_per_second,
      enabled,
    });

    const savedMachine = await newMachine.save();
    res.status(201).json(savedMachine);
  } catch (err) {
    res.status(500).json({ message: "Error creating machine", error: err.message });
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

// Update Machine by ID
exports.updateMachine = async (req, res) => {
  try {
    const { hub_id, port_position, name, mode, price, pulses_per_second, enabled } = req.body;

    // Find the hub by hub_id
    const hub = await Hub.findOne({ hub_id });
    if (!hub) {
      return res.status(404).json({ message: "Hub not found" });
    }

    // Update the machine
    const updatedMachine = await Machine.findByIdAndUpdate(
      req.params.id,
      { hub: hub._id, port_position, name, mode, price, pulses_per_second, enabled },
      { new: true }
    ).populate("hub");

    if (!updatedMachine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    res.status(200).json(updatedMachine);
  } catch (err) {
    res.status(500).json({ message: "Error updating machine", error: err.message });
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
