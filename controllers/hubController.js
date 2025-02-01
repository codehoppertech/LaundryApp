const Hub = require("../models/Hub");

exports.addHub = async (req, res) => {
  try {
    const { locationId, macAddress, serialNumber } = req.body;
    const hub = new Hub({ locationId, macAddress, serialNumber });
    await hub.save();
    res.status(201).json({ message: "Hub added successfully", hubId: hub._id });
  } catch (error) {
    res.status(500).json({ message: "Error adding hub." });
  }
};
