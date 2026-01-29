import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authenticate(req, res, requiredRole = null) {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided, access denied." });
    return false;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (requiredRole && req.user.role !== requiredRole) {
      res.status(403).json({ message: "You do not have permission to access this resource." });
      return false;
    }

    return true;
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Invalid or expired token." });
    return false;
  }
}
