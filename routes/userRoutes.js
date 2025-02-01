const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/logout", authMiddleware, userController.logoutUser);

module.exports = router;
