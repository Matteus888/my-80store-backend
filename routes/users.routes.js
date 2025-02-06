const express = require("express");
const { register, login, addAddress, getAddresses, updateAddress, removeAddress } = require("../controllers/user.controller");
const router = express.Router();

// Route pour l'inscription
router.post("/register", register);

// Route pour l'authentification
router.post("/login", login);

// Route pour ajouter une adresse à un utilisateur
router.post("/addAddress", addAddress);

// Route pour récupérer les adresses d'un utilisateur
router.get("/addresses", getAddresses);

// Route pour mettre à jour une adresse
router.put("/updateAddress", updateAddress);

// Route pour supprimer une adresse
router.delete("/removeAddress", removeAddress);

module.exports = router;
