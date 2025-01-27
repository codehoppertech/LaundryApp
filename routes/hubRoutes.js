// const express = require('express');
// const { 
//   fetchAvailablePorts, 
//   addOrUpdateMachine, 
//   removeMachine ,
//   addDevice
// } = require('../controllers/hubController');
// const router = express.Router();
// router.post('/device',addDevice);
// router.get('/:hubId/ports', fetchAvailablePorts);
// router.put('/:hubId/port/:portId/machine', addOrUpdateMachine);
// router.delete('/:hubId/port/:portId/machine', removeMachine);

// module.exports = router;

const express = require('express');
const {
  createHub,
  addDevice,
  fetchAvailablePorts,
  addOrUpdateMachine,
  removeMachine,
} = require('../controllers/hubController');

const router = express.Router();

// Hub routes
router.post('/add', createHub);
router.post('/device', addDevice);
router.get('/:hubId/ports', fetchAvailablePorts);
router.put('/:hubId/port/:portId/machine', addOrUpdateMachine);
router.delete('/:hubId/port/:portId/machine', removeMachine);

module.exports = router;