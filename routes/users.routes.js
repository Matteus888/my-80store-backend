const express = require("express");
const {
  register,
  login,
  logout,
  getInfos,
  addAddress,
  getAddresses,
  updateAddress,
  removeAddress,
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route pour l'inscription
router.post("/register", register);

// Route pour l'authentification
router.post("/login", login);

// Route pour se déconnecter
router.post("/logout", logout);

// Route pour récupérer toutes les infos d'un utilisateur
router.get("/", authenticate("user"), getInfos);

// Route pour ajouter une adresse à un utilisateur
router.post("/addAddress", authenticate("user"), addAddress);

// Route pour récupérer les adresses d'un utilisateur
router.get("/addresses", authenticate("user"), getAddresses);

// Route pour mettre à jour une adresse
router.put("/updateAddress", authenticate("user"), updateAddress);

// Route pour supprimer une adresse
router.delete("/removeAddress", authenticate("user"), removeAddress);

module.exports = router;
