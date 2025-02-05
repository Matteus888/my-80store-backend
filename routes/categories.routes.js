const express = require("express");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

// Route pour récupérer toutes les catégories
router.get("/", categoryController.getCategories);

// Route pour ajouter une catégorie
router.post("/", categoryController.addCategory);

module.exports = router;
