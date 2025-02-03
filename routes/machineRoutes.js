const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machineController"); // Assuming your controller is in the controllers folder

// Create a new Machine
router.post("/machines", machineController.createMachine);

// Get all Machines
router.get("/machines", machineController.getAllMachines);

// Get Machine by ID
router.get("/machines/:id", machineController.getMachineById);

// Update Machine by ID
router.put("/machines/:id", machineController.updateMachine);

// Delete Machine by ID
router.delete("/machines/:id", machineController.deleteMachine);

module.exports = router;
