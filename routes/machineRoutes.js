const express = require("express");
const machineController = require("../controllers/machineController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, machineController.addMachine);

module.exports = router;
