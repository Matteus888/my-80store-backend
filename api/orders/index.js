import "../../config/connection.js";
import { createOrder, getAllMyOrders } from "../../controllers/order.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case "GET":
        await getAllMyOrders(req, res);
        break;
      case "POST":
        await createOrder(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Error in /api/orders:", error);
    res.status(500).json({ message: "Server error" });
  }
}
