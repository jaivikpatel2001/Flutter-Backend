const jwt = require("jsonwebtoken");

// ✅ Authenticate Middleware
exports.authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token correctly

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ Check if user is Superadmin
exports.isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Access restricted to Superadmin" });
  }

  next();
};

// ✅ Role-based authorization
exports.roleAuth = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access Forbidden" });
    }
    next();
};
