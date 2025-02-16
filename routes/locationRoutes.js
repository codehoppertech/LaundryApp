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
const {
    createLocation,
    getLocationsByBusiness,
    getLocationById,
    updateLocation,
    deleteLocation,
    updatePayJunctionDetails,
    uploadLogo,
    updateCustomizeApp,
    updateSchedule
     } = require("../controllers/locationController");

// Create a new Location
router.post('/createLocation', createLocation);
router.post('/payjunction', updatePayJunctionDetails);
// Get all Locations by Business ID
router.get('/getLocationsByBusiness/business/:businessId', getLocationsByBusiness);
router.post("/:location_id/logo",uploadLogo);
router.put("/:location_id/customize-app",updateCustomizeApp);
router.put("/:location_id/schedule",updateSchedule);


// Get a Location by ID
router.get('/:id', getLocationById);

// Update a Location by ID
router.put('/:id', updateLocation);

// Delete a Location by ID
router.delete('/deleteLocation/:id', deleteLocation);

// // Get Location Count by Business ID
// router.get('/locations/business/:businessId/count', locationController.getLocationCountByBusiness);

// // Get Locations by City
// router.get('/locations/city/:cityName', locationController.getLocationsByCity);

module.exports = router;




