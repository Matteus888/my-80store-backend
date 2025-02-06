const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  markOrderAsPaid,
} = require("../controllers/order.controller");
const router = express.Router();

// Route pour créer une commande
router.post("/", createOrder);

// Route pour récupérer toutes les commandes
router.get("/", getOrders);

// Route pour récupérer une commande spécifique
router.get("/:id", getOrderById);

// Route pour annuler une commande
router.put("/:id/cancel", cancelOrder);

// Route pour marquer une commande comme payée
router.put("/:id/pay", markOrderAsPaid);

// Route pour mettre à jour le status d'une commande
router.put("/:id/status", updateOrderStatus);

module.exports = router;
