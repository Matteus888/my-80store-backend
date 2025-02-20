const express = require("express");
const { getProductBySlug, getProducts, createProduct, updateProduct } = require("../controllers/product.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route pour récupérer tous les produits
router.get("/", getProducts);

// Route pour récupérer un produit
router.get("/:slug", getProductBySlug);

// Route pour ajouter un produit
router.post("/", authenticate("admin"), createProduct);

// Route pour mettre à jour un produit
router.put("/:slug", authenticate("admin"), updateProduct);

module.exports = router;
