import connectDB from "../../config/connection.js";
import { authenticate } from "../../middlewares/auth.js"; // ton middleware auth
import {
  createOrder,
  getAllMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  markOrderAsPaid,
} from "../../controllers/order.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS pour le front
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await connectDB();

  const { action, id } = req.query;
  if (id) req.params = { id }; // pour les controllers existants

  try {
    // 🔐 Toutes les routes nécessitent un utilisateur connecté
    let isAuthenticated = false;
    await authenticate()(req, res, () => {
      isAuthenticated = true;
    });
    if (!isAuthenticated) return; // réponse déjà envoyée par le middleware

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
