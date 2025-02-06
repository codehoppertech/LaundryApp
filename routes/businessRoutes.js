const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware to allow only BusinessOwnersBusiness Owner
const requireBusinessOwner = authMiddleware("Business Owner");

// Route to create a new business
router.post("/businesses", requireBusinessOwner, businessController.createBusiness);

// Route to get all businesses
router.get("/businesses", requireBusinessOwner, businessController.getAllBusinesses);

// Route to get a business by ID
router.get("/businesses/:id", requireBusinessOwner, businessController.getBusinessById);

// Route to update a business by ID
router.put("/businesses/:id", requireBusinessOwner, businessController.updateBusiness);

// Route to delete a business by ID
router.delete("/businesses/:id", requireBusinessOwner, businessController.deleteBusiness);

module.exports = router;
