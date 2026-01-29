import "../../config/connection.js";
import { createPayment } from "../../controllers/payment.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    await createPayment(req, res);
  } else {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
