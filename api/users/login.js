import "../../config/connection.js";
import { login } from "../../controllers/user.controller.js";

export default async function handler(req, res) {
  // --- Gérer CORS ---
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    // Réponse au preflight
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    await login(req, res);
  } else {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
