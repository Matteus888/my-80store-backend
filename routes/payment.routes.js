const express = require("express");
const { createPayment, verifyPayment } = require("../controllers/payment.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route pour paiement d'une commande
router.post("/", authenticate("user"), createPayment);

// Route pour vérifier le status du paiement
router.get("/verify-session/:sessionId", authenticate("user"), verifyPayment);

module.exports = router;
