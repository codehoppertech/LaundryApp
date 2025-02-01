const express = require("express");
const hubController = require("../controllers/hubController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, hubController.addHub);

module.exports = router;
