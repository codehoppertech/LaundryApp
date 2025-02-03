const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Assuming your controller is in the controllers folder

// Create a new User
router.post("/users", userController.createUser);

// Get all Users
router.get("/users", userController.getAllUsers);

// Get User by ID
router.get("/users/:id", userController.getUserById);

// Update User by ID
router.put("/users/:id", userController.updateUser);

// Delete User by ID
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
