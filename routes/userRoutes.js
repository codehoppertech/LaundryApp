const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { 
   
  } = require('../controllers/userController');;
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
router.get('/profile', userController.fetchUserProfileDetails);
router.put('/profile', userController.editUserProfileDetails);
router.post('/change-password', userController.changePassword);

module.exports = router; 