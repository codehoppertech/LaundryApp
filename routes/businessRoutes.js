const express = require('express');
// const {createBusiness,  
//     addPayJunctionDetails, 
//     connectOrPurchaseHub, 
//     addDeviceInformation,fetchAllBusinessLocations, 
//     addNewBusinessLocation } = require('../controllers/businessController');
// const router = express.Router();

// router.post('/create', createBusiness);
// //router.post('/location', addBusinessLocation);
// router.post('/payjunction', addPayJunctionDetails);
// router.post('/hub', connectOrPurchaseHub);
// router.post('/device', addDeviceInformation);
// router.get('/:business_id/locations', fetchAllBusinessLocations);
// router.post('/location', addNewBusinessLocation);
// module.exports = router;

//const express = require('express');
const {
  createBusiness,
  fetchAllBusinessLocations,
  addNewBusinessLocation,
  addPayJunctionDetails,
  connectOrPurchaseHub,
  addDeviceInformation,
  addBusinessLocation, // NEW
} = require('../controllers/businessController');

const router = express.Router();

// Business routes
router.post('/create', createBusiness);
router.post('/payjunction', addPayJunctionDetails);
router.post('/hub', connectOrPurchaseHub);
router.post('/device', addDeviceInformation);
router.get('/:business_id/locations', fetchAllBusinessLocations);
router.post('/location', addNewBusinessLocation);
router.post('/add-location', addBusinessLocation); // NEW

module.exports = router;