import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticate(req) {
  const token = req.cookies?.token;

  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return true;
  } catch (err) {
    console.error("JWT error:", err);
    return false;
  }
}
