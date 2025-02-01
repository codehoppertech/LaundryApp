const Machine = require("../models/Machine");

exports.addMachine = async (req, res) => {
  try {
    const { hubId, portPosition, name, mode, price, pulsesPerSecond, enabled } = req.body;
    const machine = new Machine({ hubId, portPosition, name, mode, price, pulsesPerSecond, enabled });
    await machine.save();
    res.status(201).json({ message: "Machine added successfully", machineId: machine._id });
  } catch (error) {
    res.status(500).json({ message: "Error adding machine." });
  }
};
