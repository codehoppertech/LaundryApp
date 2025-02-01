const express = require("express");
const sessionController = require("../controllers/sessionController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/invalidate", authMiddleware, sessionController.invalidateSession);

module.exports = router;
