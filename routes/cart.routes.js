const express = require("express");
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cart.controller");
const router = express.Router();

// Route pour récupérer le panier d'un utilisateur
router.get("/", getCart);

// Route pour ajouter un produit au panier
router.post("/add", addToCart);

// Route pour mettre à jour la quantité d'un produit dans le panier
router.put("/update", updateCartItem);

// Route pour supprimer un produit du panier
router.delete("/:slug", removeFromCart);

// Route pour vider le panier
router.delete("/", clearCart);

module.exports = router;
