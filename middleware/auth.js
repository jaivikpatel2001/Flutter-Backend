const jwt = require("jsonwebtoken");

// Verify JWT token from cookies
exports.authenticate = (req, res, next) => {
  const token = req.cookies.token;
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

// Verify user has one of the allowed roles
exports.roleAuth = (roles) => (req, res, next) => {
    if (!req.user) return res.status(403).json({ message: "Access Forbidden. Please log in." });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: `Access Denied. ${req.user.role} role is not authorized to access this resource.` });
    next();
};
