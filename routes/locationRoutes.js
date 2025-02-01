const express = require("express");
const locationController = require("../controllers/locationController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, locationController.addLocation);
router.get("/:businessId", authMiddleware, locationController.getLocations);

module.exports = router;
