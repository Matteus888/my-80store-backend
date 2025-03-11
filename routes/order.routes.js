const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  markOrderAsPaid,
} = require("../controllers/order.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route pour créer une commande
router.post("/", authenticate("user"), createOrder);

// Route pour récupérer une commande spécifique
router.get("/:id", authenticate("user"), getOrderById);

// Route pour récupérer toutes les commandes d'un utilisateur
router.get("/all/:userId", authenticate("user"), getOrders);

// Route pour annuler une commande
router.put("/:id/cancel", authenticate("user"), cancelOrder);

// Route pour marquer une commande comme payée
router.put("/:id/pay", authenticate("user"), markOrderAsPaid);

// Route pour mettre à jour le status d'une commande
router.put("/:id/status", authenticate("admin"), updateOrderStatus);

module.exports = router;
