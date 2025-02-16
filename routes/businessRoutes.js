const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");
const authMiddleware = require("../middleware/authMiddleware");


const {
    createBusiness,
    getAllBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness
     } = require("../controllers/businessController");
// Middleware to allow only BusinessOwnersBusiness Owner
//const requireBusinessOwner = authMiddleware("Business Owner");

// Route to create a new business
router.post("/createBusiness", createBusiness);

// Route to get all businesses
router.get("/getAllBusinesses", getAllBusinesses);

// Route to get a business by ID
router.get("/getBusinessById/:id",getBusinessById);

// Route to update a business by ID
router.put("/updateBusiness/:id",updateBusiness);

// Route to delete a business by ID
router.delete("/deleteBusiness/:id", deleteBusiness);

module.exports = router;
