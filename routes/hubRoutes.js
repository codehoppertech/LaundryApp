const express = require('express');
const router = express.Router();
const {
    createHub,
    getAllHubs,
    getHubById,
    updateHubName,
    deleteHub,
    addOrUpdatePortsToHub,
    getPortsFromHub
     } = require("../controllers/hubController");
// Middleware to allow only BusinessOwnersBusiness Owner
//const requireBusinessOwner = authMiddleware("Business Owner");
// Create a new Hub
router.post('/createHub', createHub);

// Get all Hubs
router.get('/getAllHubs', getAllHubs);

// Get Hub by ID
router.get('/:id', getHubById);
router.get('/ports/:hub_id', getPortsFromHub);
// Update Hub by ID
router.put('/updateHubName', updateHubName);
router.put('/:hub_id/ports', addOrUpdatePortsToHub);
// Delete Hub by ID
router.delete('/:id', deleteHub);

module.exports = router;
// {
//     "business_id": "Business001",
//     "location_id": "Location001",
//     "mac_address": "00:1A:2B:3C:4D:5E",
//     "serial_number": "SN123456",
//     "ports": [
//       { "port_number": 1, "machine": "Machine001" }
//     ]
//   }