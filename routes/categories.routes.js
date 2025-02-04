const express = require("express");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

// Route pour ajouter une catégorie
router.post("/", categoryController.addCategory);

module.exports = router;
