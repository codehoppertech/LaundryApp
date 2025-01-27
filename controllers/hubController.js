const Hub = require('../models/Hub');
const Machine = require('../models/Machine');
const Port = require('../models/Port');

exports.createHub = async (req, res) => {
  try {
    const { business_id,location_id,name,description, hub_status } = req.body;
    const hub = new Hub({ location_id,business_id, hub_status,name,description, devices: [] });
    await hub.save();
    res.status(201).json({ message: 'Hub created successfully', hub });
  } catch (err) {
    res.status(500).json({ message: 'Error creating hub', error: err.message });
  }
};

// exports.addDevice = async (req, res) => {
//   try {
//     const { hub_id, mac_address, serial_number } = req.body;
//     const hub = await Hub.findOne({hub_id: hub_id});
//    // const business = await Business.findOne({ business_id: business_id });
//     if (!hub) return res.status(404).json({ message: 'Hub not found' });

//     hub.devices.push({ mac_address, serial_number });
//     await hub.save();
//     res.status(201).json({ message: 'Device added successfully', hub });
//   } catch (err) {
//     res.status(500).json({ message: 'Error adding device', error: err.message });
//   }
// };

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


// Fetch Available I/O Ports for Hub
exports.fetchAvailablePorts = async (req, res) => {
  try {
    const { hubId } = req.params;

    if (!hubId) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing or invalid hub ID.',
        errors: null,
      });
    }

    const hub = await Hub.findById(hubId).populate('ports');
    if (!hub) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Hub not found.',
        errors: null,
      });
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'I/O ports fetched successfully.',
      data: {
        ports: hub.ports,
      },
      errors: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Server error.',
      errors: error.message,
    });
  }
};

// // Add or Update Machine on Selected I/O Port
exports.addOrUpdateMachine = async (req, res) => {
  try {
    const { hubId, portId } = req.params;
    const { machine_name, mode, price, pulses_per_second, port_enabled } = req.body;

    if (!hubId || !portId || !machine_name || !mode || !price || !pulses_per_second || port_enabled === undefined) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing or invalid parameters.',
        errors: null,
      });
    }

    const machine = await Machine.findOneAndUpdate(
      { hubId, portId },
      { machine_name, mode, price, pulses_per_second, port_enabled },
      { new: true, upsert: true }
    );

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Machine added or updated on port successfully.',
      data: {
        machine_id: machine._id,
        port_id: portId,
        hub_id: hubId,
      },
      errors: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Server error.',
      errors: error.message,
    });
  }
};

// // Remove Machine from I/O Port
exports.removeMachine = async (req, res) => {
  try {
    const { hubId, portId } = req.params;

    if (!hubId || !portId) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Missing or invalid parameters.',
        errors: null,
      });
    }

    const machine = await Machine.findOneAndDelete({ hubId, portId });
    if (!machine) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Machine not found on the specified port.',
        errors: null,
      });
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Machine removed from port successfully.',
      data: {
        port_id: portId,
        hub_id: hubId,
      },
      errors: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Server error.',
      errors: error.message,
    });
  }
};
 // Assuming you have a Machine model

// Add or update device in a hub (via port)
exports.addDevice = async (req, res) => {
  const { hubId, portId } = req.params;
  try {
    // Validate required fields in request body
    const { machine_name, mode, price, pulses_per_second, port_enabled } = req.body;
    if (!machine_name || !mode || !price || !pulses_per_second || port_enabled === undefined) {
      return res.status(400).json({ error: "Missing required fields in request body" });
    }

    // Find port by hubId and portId
    const port = await Port.findOne({ hub_id: hubId, _id: portId });
    if (!port) {
      return res.status(404).json({ error: "Port not found" });
    }

    // Update or add the machine to the port
    port.machine = {
      machine_id: new mongoose.Types.ObjectId(),  // Auto-generate machine_id
      machine_name,
      mode,
      price,
      pulses_per_second,
      port_enabled,
      assigned_at: new Date(),
    };

    await port.save();
    res.status(200).json(port);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
