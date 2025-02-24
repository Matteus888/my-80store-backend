const express = require("express");
const { createPayment } = require("../controllers/payment.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route pour paiement d'une commande
router.post("/", authenticate("user"), createPayment);

module.exports = router;
