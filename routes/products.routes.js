const express = require("express");
const { getProductBySlug, getProducts, createProduct } = require("../controllers/product.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route pour récupérer tous les produits
router.get("/", getProducts);

// Route pour récupérer un produit
router.get("/:slug", getProductBySlug);

// Route pour ajouter un produit
router.post("/", authenticate("admin"), createProduct);

module.exports = router;
