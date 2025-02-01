const express = require("express");
const businessController = require("../controllers/businessController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, businessController.createBusiness);
router.get("/", authMiddleware, businessController.getBusinesses);

module.exports = router;
