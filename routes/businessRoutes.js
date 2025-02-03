const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");

// Route to create a new business
router.post("/businesses", businessController.createBusiness);

// Route to get all businesses
router.get("/businesses", businessController.getAllBusinesses);

// Route to get a business by ID
router.get("/businesses/:id", businessController.getBusinessById);

// Route to update a business by ID
router.put("/businesses/:id", businessController.updateBusiness);

// Route to delete a business by ID
router.delete("/businesses/:id", businessController.deleteBusiness);

module.exports = router;
