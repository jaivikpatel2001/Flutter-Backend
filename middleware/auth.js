const jwt = require("jsonwebtoken");
const Permission = require('../models/Permission');
const { getUserByIdHandler } = require("../controllers/userController");
const User = require("../models/User");

// Verify JWT token from Authorization header
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ message: "Authentication required. Please login to access this resource." });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Verify superadmin role
exports.isSuperAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized. Please log in." });
  if (req.user.role !== "superadmin") return res.status(403).json({ message: "Access restricted to Superadmin" });
  next();
};



// Middleware to check user role
exports.roleCheck = (roles) => (req, res, next) => {
  if (!req.user) return res.status(403).json({ message: "Access Forbidden. Please log in." });

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access Denied. ${req.user.role} role is not authorized to access this resource.` });
  }
  next();
};

// Middleware to check user permission
exports.permissionCheck = () => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const userResponse = await getUserByIdHandler(userId); // Call function with userId only

      if (userResponse.error) {
        return res.status(403).json({ message: `Access denied. ${userResponse.error}` });
      }

      const user = userResponse.user;

      if (!user.permissions || !Array.isArray(user.permissions) || user.permissions.length === 0) {
        return res.status(403).json({ message: "Access denied. No permissions available." });
      }

      req.userDetails = user; // Store user details in request for further middleware
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
