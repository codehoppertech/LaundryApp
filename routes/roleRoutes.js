const express = require("express");
const roleController = require("../controllers/userRoleController");

const router = express.Router();

// Routes
router.get("/email/:email", roleController.getRolesByEmail); // Fetch roles
router.post("/create", roleController.createRole); // Create a new role
router.put("/:id", roleController.updateRole); // Update an existing role
//router.delete("/roles/:id", roleController.deleteRole); // Delete a role

module.exports = router;