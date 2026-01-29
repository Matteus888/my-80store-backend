import { logout } from "../../controllers/user.controller.js";

const allowedOrigins = ["http://localhost:5173", "https://my-80store-frontend.vercel.app"];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") return logout(req, res);

  return res.status(405).json({ message: "Method not allowed" });
}
