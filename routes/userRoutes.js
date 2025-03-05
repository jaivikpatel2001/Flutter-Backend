const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
  logoutUser,
  getUsers,
  getUserById,
  forgotPassword,
  resetPassword,
  updateUserProfile, // Added updateUserProfile
  deleteUser, // Added deleteUser
} = require("../controllers/userController");
const {
  authenticate,
  roleCheck,
  permissionCheck,
} = require("../middleware/auth");

const router = express.Router();

// Authentication routes
router.post("/login", loginUser);
router.post("/logout", authenticate, logoutUser);

// Password management routes
router.put("/change-password", authenticate, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// User management routes
router.post("/register", authenticate, registerUser);
router.get("/", authenticate, roleCheck(["superadmin","club"]), getUsers);
router.get("/:id", authenticate, getUserById);
router.put("/profile/:id", authenticate, updateUserProfile); // Added route for updating user profile
router.delete("/:id", authenticate, roleCheck(["superadmin","club"]), deleteUser); // Added route for deleting user

module.exports = router;
