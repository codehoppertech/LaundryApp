const express = require('express');
const { createBusiness, addLocation } = require('../controllers/businessController');
const router = express.Router();

router.post('/create', createBusiness);
router.post('/location', addLocation);

module.exports = router;