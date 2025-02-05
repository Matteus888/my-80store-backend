const express = require("express");
const { addToCart } = require("../controllers/cart.controller");
const router = express.Router();

// Route pour ajouter un produit au panier
router.post("/add", addToCart);

// Route pour mettre à jour la quantité d'un produit dans le panier

// Route pour supprimer un produit du panier

// Route pour récupérer le panier d'un utilisateur

// Route pour vider le panier

module.exports = router;
