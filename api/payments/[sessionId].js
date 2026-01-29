import "../../config/connection.js";
import { verifyPayment } from "../../controllers/payment.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { sessionId } = req.query;
  req.params = { sessionId }; // pour que ton controller continue de fonctionner

  if (req.method === "GET") {
    await verifyPayment(req, res);
  } else {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
