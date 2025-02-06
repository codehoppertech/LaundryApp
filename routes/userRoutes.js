const express = require("express");
const router = express.Router();
const {
  createAccount,
  profile,
  inviteUser,
  validateAccount,
  updatePassword,
  login,
  validateResetCode,
  forgotPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  removeUser,
  logout,
  fetchUserProfileDetails,
  editUserProfileDetails,
  changePassword
} = require("../controllers/userController");

// Routes
router.post("/create-account", createAccount);
router.post("/invite", inviteUser);
router.post("/validate-account", validateAccount);
router.put("/update-password", updatePassword);
router.put("/validate-reset-code", validateResetCode);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post('/logout', logout);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/remove", removeUser);
router.delete("/users/:id", deleteUser);
router.get('/profile', fetchUserProfileDetails);
router.put('/profile', editUserProfileDetails);
router.post('/change-password', changePassword);
module.exports = router;
