import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware async pour serverless
export async function authenticate(req, res) {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: "No token provided, access denied." });
    return false;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return true; // auth OK
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Invalid or expired token" });
    return false;
  }
}
