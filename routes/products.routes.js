const express = require("express");
const { getProducts, createProduct } = require("../controllers/product.controller");

const router = express.Router();

// Route pour récupérer tous les produits
router.get("/", getProducts);

// Route pour ajouter un produit
router.post("/", createProduct);

module.exports = router;
