const express = require("express");
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route pour récupérer le panier d'un utilisateur
router.get("/", authenticate("user"), getCart);

// Route pour ajouter un produit au panier
router.post("/add", authenticate("user"), addToCart);

// Route pour mettre à jour la quantité d'un produit dans le panier
router.put("/update", authenticate("user"), updateCartItem);

// Route pour supprimer un produit du panier
router.delete("/:slug", authenticate("user"), removeFromCart);

// Route pour vider le panier
router.delete("/", authenticate("user"), clearCart);

module.exports = router;
