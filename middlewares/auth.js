import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authenticate(req, res) {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return true;
  } catch {
    res.status(401).json({ message: "Invalid token" });
    return false;
  }
}
