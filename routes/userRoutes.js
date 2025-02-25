const express = require("express");
const { registerUser, loginUser, changePassword, logoutUser } = require("../controllers/userController");
const { authenticate, isSuperAdmin } = require("../middleware/auth");

const router = express.Router();

// ✅ Only Superadmin can create users
router.post("/register", authenticate, isSuperAdmin, registerUser);

// ✅ Any user can log in
router.post("/login", loginUser);

// ✅ Only authenticated users can change passwords
router.put("/change-password", authenticate, changePassword);

// ✅ Only authenticated users can log out
router.post("/logout", authenticate, logoutUser);

module.exports = router;
