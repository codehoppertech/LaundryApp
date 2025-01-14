const express = require('express');
const { createHub, addDevice, fetchPorts } = require('../controllers/hubController');
const router = express.Router();

router.post('/create', createHub);
router.post('/device', addDevice);
router.get('/:hub_id/ports', fetchPorts);

module.exports = router;