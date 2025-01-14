const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// Public routes
router.post('/create', userController.createAccount);
router.post('/validate', userController.validateAccount);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/validate-reset-code', userController.validateResetCode);

// Protected routes (require authentication)
router.post('/update-password', auth, userController.updatePassword);
router.post('/logout', auth, userController.logout);
router.delete('/remove', auth, userController.removeUser);

module.exports = router;