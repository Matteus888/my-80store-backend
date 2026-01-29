import connectDB from "../../config/connection";
import authMiddleware from "../../middlewares/auth.middleware";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  reorder,
} from "../../controllers/cart.controller";

export default async function handler(req, res) {
  await connectDB();
  await authMiddleware(req, res);

  const { action } = req.query;

  if (req.method === "GET" && action === "get") {
    return getCart(req, res);
  }

  if (req.method === "POST" && action === "add") {
    return addToCart(req, res);
  }

  if (req.method === "PUT" && action === "update") {
    return updateCartItem(req, res);
  }

  if (req.method === "POST" && action === "reorder") {
    return reorder(req, res);
  }

  if (req.method === "DELETE" && action === "remove") {
    return removeFromCart(req, res);
  }

  if (req.method === "DELETE" && action === "clear") {
    return clearCart(req, res);
  }

  return res.status(405).json({ message: "Method or action not allowed" });
}
