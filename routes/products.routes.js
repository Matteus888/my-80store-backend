const express = require("express");
const { getProductBySlug, getProducts, createProduct } = require("../controllers/product.controller");

const router = express.Router();

// Route pour récupérer un produit
router.get("/:slug", getProductBySlug);

// Route pour récupérer tous les produits
router.get("/", getProducts);

// Route pour ajouter un produit
router.post("/", createProduct);

module.exports = router;
