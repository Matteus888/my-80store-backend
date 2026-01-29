import "../../config/connection.js";
import { createPayment, verifyPayment } from "../../controllers/payment.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { action, sessionId } = req.query;
  if (sessionId) req.params = { sessionId }; // pour le controller existant

  try {
    // 💳 Créer un paiement
    if (req.method === "POST" && action === "create") {
      return await createPayment(req, res);
    }

    // 🔍 Vérifier un paiement
    if (req.method === "GET" && action === "verify") {
      if (!sessionId) {
        return res.status(400).json({ message: "sessionId is required" });
      }
      return await verifyPayment(req, res);
    }

    res.status(405).json({ message: "Method or action not allowed" });
  } catch (error) {
    console.error("Error in /api/payments:", error);
    res.status(500).json({ message: "Server error" });
  }
}
