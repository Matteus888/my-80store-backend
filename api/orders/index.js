import connectDB from "../../config/connection.js";
import common from "../_middlewares/common.js";
import authenticate from "../../middlewares/auth.js";

import {
  createOrder,
  getAllMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  markOrderAsPaid,
} from "../../controllers/order.controller.js";

export default async function handler(req, res) {
  common(req, res);
  await connectDB();

  const { action, id } = req.query;

  const isAuth = await authenticate(req, res);
  if (!isAuth) return;

  if (id) req.params = { id };

  try {
    if (req.method === "POST" && action === "create") return createOrder(req, res);
    if (req.method === "GET" && action === "my") return getAllMyOrders(req, res);
    if (req.method === "GET" && action === "byId") return getOrderById(req, res);
    if (req.method === "PUT" && action === "cancel") return cancelOrder(req, res);
    if (req.method === "PUT" && action === "markPaid") return markOrderAsPaid(req, res);
    if (req.method === "PUT" && action === "updateStatus") return updateOrderStatus(req, res);

    res.status(405).json({ message: "Method or action not allowed" });
  } catch (err) {
    console.error("Orders API error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
