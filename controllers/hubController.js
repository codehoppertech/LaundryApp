const Hub = require('../models/Hub');

exports.createHub = async (req, res) => {
  try {
    const { business_id, hub_status } = req.body;
    const hub = new Hub({ business_id, hub_status, devices: [] });
    await hub.save();
    res.status(201).json({ message: 'Hub created successfully', hub });
  } catch (err) {
    res.status(500).json({ message: 'Error creating hub', error: err.message });
  }
};

exports.addDevice = async (req, res) => {
  try {
    const { hub_id, mac_address, serial_number } = req.body;
    const hub = await Hub.findById(hub_id);
    if (!hub) return res.status(404).json({ message: 'Hub not found' });

    hub.devices.push({ mac_address, serial_number });
    await hub.save();
    res.status(201).json({ message: 'Device added successfully', hub });
  } catch (err) {
    res.status(500).json({ message: 'Error adding device', error: err.message });
  }
};

exports.fetchPorts = async (req, res) => {
  try {
    const { hub_id } = req.params;
    const hub = await Hub.findById(hub_id);
    if (!hub) return res.status(404).json({ message: 'Hub not found' });

    res.status(200).json({ message: 'Ports fetched successfully', ports: hub.devices });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ports', error: err.message });
  }
};
