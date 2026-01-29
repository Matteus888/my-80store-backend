import connectDB from "../../config/connection.js";
import common from "../_middlewares/common.js";
import { authenticate } from "../../middlewares/auth.js";

import { createPayment, verifyPayment } from "../../controllers/payment.controller.js";

export default async function handler(req, res) {
  common(req, res);
  await connectDB();

  const isAuth = await authenticate(req, res);
  if (!isAuth) return;

  const { action, sessionId } = req.query;
  if (sessionId) req.params = { sessionId };

  try {
    if (req.method === "POST" && action === "create") return createPayment(req, res);
    if (req.method === "GET" && action === "verify") {
      if (!sessionId) return res.status(400).json({ message: "sessionId is required" });
      return verifyPayment(req, res);
    }

    res.status(405).json({ message: "Method or action not allowed" });
  } catch (err) {
    console.error("Payments API error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
