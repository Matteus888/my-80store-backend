const express = require("express");
const { register, login } = require("../controllers/user.controller");
const router = express.Router();

// Route pour l'inscription
router.post("/register", register);

// Route pour l'authentification
router.post("/login", login);

module.exports = router;
