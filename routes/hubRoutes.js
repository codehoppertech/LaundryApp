const express = require('express');
const router = express.Router();
const hubController = require('../controllers/hubController');

// Create a new Hub
router.post('/hubs', hubController.createHub);

// Get all Hubs
router.get('/hubs', hubController.getAllHubs);

// Get Hub by ID
router.get('/hubs/:id', hubController.getHubById);

// Update Hub by ID
router.put('/hubs/:id', hubController.updateHub);

// Delete Hub by ID
router.delete('/hubs/:id', hubController.deleteHub);

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