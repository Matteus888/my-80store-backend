const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware pour vérifier le token venant des cookies
const authenticate = (requiredRole) => {
  return function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      console.error("No token provided.");
      return res.status(401).json({ error: "No token provided, access denied." });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ message: "You do not have permission to access this resource" });
      }

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = { authenticate };
