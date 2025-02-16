const express = require("express");
const router = express.Router();
 // Assuming your controller is in the controllers folder
const {
    createMachine,
    getMachineById,
    deleteMachine,
    getAllMachines,
    updateMachine,
    getAllMachinesByHubId,
     } = require("../controllers/machineController");
// Create a new Machine
router.post("/addMachine",createMachine);

// Get all Machines
router.get("/machines", getAllMachines);

// Get Machine by ID
router.get("/machines/:id", getMachineById);

// Update Machine by ID
router.put("/:id",updateMachine);

// Delete Machine by ID
router.delete("/machines/:id", deleteMachine);
router.get("/:hub_id", getAllMachinesByHubId);
module.exports = router;
