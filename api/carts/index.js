import connectDB from "../../config/connection.js";
import { authenticate } from "../../middlewares/auth.js"; // ton authMiddleware
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  reorder,
} from "../../controllers/cart.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await connectDB();

  // 🔐 Authentification
  let isAuthenticated = false;
  await authenticate()(req, res, () => {
    isAuthenticated = true; // si le middleware passe
  });
  if (!isAuthenticated) return; // réponse envoyée par le middleware si non autorisé

  const { action } = req.query;

  try {
    if (req.method === "GET" && action === "get") {
      return await getCart(req, res);
    }

    if (req.method === "POST" && action === "add") {
      return await addToCart(req, res);
    }

    if (req.method === "PUT" && action === "update") {
      return await updateCartItem(req, res);
    }

    if (req.method === "POST" && action === "reorder") {
      return await reorder(req, res);
    }

    if (req.method === "DELETE" && action === "remove") {
      return await removeFromCart(req, res);
    }

    if (req.method === "DELETE" && action === "clear") {
      return await clearCart(req, res);
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
    return res.status(405).json({ message: "Method or action not allowed" });
  } catch (error) {
    console.error("Error in /api/carts:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
