import connectDB from "../../config/connection.js";
import common from "../_middlewares/common.js";
import { authenticate } from "../../middlewares/auth.js";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  reorder,
} from "../../controllers/cart.controller.js";

export default async function handler(req, res) {
  common(req, res);
  await connectDB();

  const { action } = req.query;

  const isAuth = await authenticate(req, res);
  if (!isAuth) return;

  try {
    if (req.method === "GET" && action === "get") return getCart(req, res);
    if (req.method === "POST" && action === "add") return addToCart(req, res);
    if (req.method === "PUT" && action === "update") return updateCartItem(req, res);
    if (req.method === "POST" && action === "reorder") return reorder(req, res);
    if (req.method === "DELETE" && action === "remove") return removeFromCart(req, res);
    if (req.method === "DELETE" && action === "clear") return clearCart(req, res);

    res.status(405).json({ message: "Method or action not allowed" });
  } catch (err) {
    console.error("Cart API error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
