import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authenticate(req, res, requiredRole = null) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Not authenticated" });
      return false;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    if (requiredRole && decoded.role !== requiredRole) {
      res.status(403).json({ message: "Forbidden" });
      return false;
    }

    return true;
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return false;
  }
}
