import "../../config/connection.js";
import { getOrderById, updateOrderStatus, cancelOrder, markOrderAsPaid } from "../../controllers/order.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Next.js serverless met les params dans query
  const { id } = req.query;
  req.params = { id };

  try {
    switch (req.method) {
      case "GET":
        await getOrderById(req, res);
        break;
      case "PUT":
        if (req.body.markPaid) {
          await markOrderAsPaid(req, res);
        } else if (req.body.status) {
          await updateOrderStatus(req, res);
        } else {
          res.status(400).json({ message: "Invalid PUT request" });
        }
        break;
      case "DELETE":
        await cancelOrder(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE", "OPTIONS"]);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Error in /api/orders/[id]:", error);
    res.status(500).json({ message: "Server error" });
  }
}
