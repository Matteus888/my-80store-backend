import "../../config/connection.js";
import {
  createOrder,
  getAllMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  markOrderAsPaid,
} from "../../controllers/order.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { action, id } = req.query;

  // simule req.params pour les controllers existants
  if (id) req.params = { id };

  try {
    // ➕ Créer une commande
    if (req.method === "POST" && action === "create") {
      return await createOrder(req, res);
    }

    // 📦 Toutes mes commandes
    if (req.method === "GET" && action === "my") {
      return await getAllMyOrders(req, res);
    }

    // 🔍 Une commande précise
    if (req.method === "GET" && action === "byId") {
      return await getOrderById(req, res);
    }

    // ❌ Annuler une commande
    if (req.method === "PUT" && action === "cancel") {
      return await cancelOrder(req, res);
    }

    // 💰 Marquer comme payée
    if (req.method === "PUT" && action === "markPaid") {
      return await markOrderAsPaid(req, res);
    }

    // 🔄 Mettre à jour le statut
    if (req.method === "PUT" && action === "updateStatus") {
      return await updateOrderStatus(req, res);
    }

    res.status(405).json({ message: "Method or action not allowed" });
  } catch (error) {
    console.error("Error in /api/orders:", error);
    res.status(500).json({ message: "Server error" });
  }
}
