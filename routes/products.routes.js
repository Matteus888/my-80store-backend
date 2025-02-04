const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

// Route pour ajouter un produit
router.post("/", productController.createProduct);

module.exports = router;
