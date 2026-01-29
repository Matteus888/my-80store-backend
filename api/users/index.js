import "../../config/connection.js";
import common from "../_middlewares/common.js"; // ton helper CORS
import { authenticate } from "../../middlewares/auth.js"; // notre middleware auth serverless

import {
  register,
  login,
  logout,
  getInfos,
  addAddress,
  getAddresses,
  updateAddress,
  removeAddress,
} from "../../controllers/user.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS
  common(req, res);

  const { action } = req.query;

  try {
    // -------- PUBLIC ROUTES --------
    if (req.method === "POST" && action === "login") {
      return await login(req, res);
    }

    if (req.method === "POST" && action === "register") {
      return await register(req, res);
    }

    if (req.method === "POST" && action === "logout") {
      return await logout(req, res);
    }

    // -------- PROTECTED ROUTES --------
    // Routes qui nécessitent un token
    const isAuthenticated = await authenticate(req, res);
    if (!isAuthenticated) return; // token invalide ou non fourni, réponse déjà gérée

    if (req.method === "GET" && action === "me") {
      return await getInfos(req, res);
    }

    if (req.method === "GET" && action === "addresses") {
      return await getAddresses(req, res);
    }

    if (req.method === "POST" && action === "address") {
      return await addAddress(req, res);
    }

    if (req.method === "PUT" && action === "address") {
      return await updateAddress(req, res);
    }

    if (req.method === "DELETE" && action === "address") {
      return await removeAddress(req, res);
    }

    // Si aucune route ne correspond
    res.status(404).json({ message: "Route not found" });
  } catch (error) {
    console.error("Users API error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
