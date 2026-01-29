import "../../config/connection.js";
import { getCart, addToCart, updateCartItem, reorder, clearCart } from "../../controllers/cart.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS pour ton frontend
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    switch (req.method) {
      case "GET":
        await getCart(req, res);
        break;
      case "POST":
        await addToCart(req, res);
        break;
      case "PUT":
        if (req.body.orderId) {
          await reorder(req, res);
        } else {
          await updateCartItem(req, res);
        }
        break;
      case "DELETE":
        await clearCart(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE", "OPTIONS"]);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Error in /api/carts:", error);
    res.status(500).json({ message: "Server error" });
  }
}
