// const express = require("express");
// const locationController = require("../controllers/locationController");;
// const router = express.Router();

// router.post("/create", locationController.createLocation);
// router.get("/", locationController.getAllLocations);
// router.get("/:id", locationController.getLocationById);
// router.put("/:id", locationController.updateLocation);
// router.delete("/:id", locationController.deleteLocation);
// module.exports = router;


const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Create a new Location
router.post('/locations', locationController.createLocation);

// Get all Locations by Business ID
router.get('/locations/business/:businessId', locationController.getLocationsByBusiness);

// Get a Location by ID
router.get('/locations/:id', locationController.getLocationById);

// Update a Location by ID
router.put('/locations/:id', locationController.updateLocation);

// Delete a Location by ID
router.delete('/locations/:id', locationController.deleteLocation);

// // Get Location Count by Business ID
// router.get('/locations/business/:businessId/count', locationController.getLocationCountByBusiness);

// // Get Locations by City
// router.get('/locations/city/:cityName', locationController.getLocationsByCity);

module.exports = router;




