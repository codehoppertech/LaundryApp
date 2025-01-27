const express = require('express');
const {
  fetchUsersList,
  addNewAccount,
  acceptRoleInvitation,
} = require('../controllers/userManagementController');

const router = express.Router();

// Account management routes
router.get('/:business_id/accounts', fetchUsersList); // Fetch accounts (formerly users)
router.post('/:business_id/account', addNewAccount); // Add a new account
router.post('/accept-role', acceptRoleInvitation); // Accept role invitation

module.exports = router;