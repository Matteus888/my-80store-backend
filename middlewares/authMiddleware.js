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

// Authenticate juste pour test
// const authentic = (req, res, next) => {
//   const simulatedUser = {
//     publicId: "67813621-3221-410e-8027-2a0912b5f41f",
//     role: "admin",
//   };
//   req.user = simulatedUser;
//   next();
// };

// Middleware pour vérifier le rôle de l'utilisateur
// const authorizeRole = (roles) => {
//   return async (req, res, next) => {
//     try {
//       const user = await User.findOne({ publicId: req.user.publicId });
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       if (!roles.includes(user.role)) {
//         return res.status(403).json({ message: "Access denied. Insufficient permissions" });
//       }

//       req.user = user;
//       next();
//     } catch (error) {
//       console.error("Role verification failed:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   };
// };

module.exports = { authenticate };
