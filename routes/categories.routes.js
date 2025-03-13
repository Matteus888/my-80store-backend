const express = require("express");
const { getCategories, addCategory } = require("../controllers/category.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route pour récupérer toutes les catégories
router.get("/", getCategories);

// Route pour ajouter une catégorie
router.post("/", authenticate("admin"), addCategory);

module.exports = router;
