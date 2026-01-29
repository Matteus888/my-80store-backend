import connectDB from "../../config/connection.js";
import { authenticate } from "../../middlewares/auth.js"; // ton auth middleware
import { getCategories, addCategory } from "../../controllers/category.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS pour le front
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await connectDB();

  try {
    if (req.method === "GET") {
      // Pas besoin d'auth pour récupérer les catégories
      return await getCategories(req, res);
    }

    if (req.method === "POST") {
      // 🔐 Authentification pour ajouter une catégorie
      let isAuthenticated = false;
      await authenticate("admin")(req, res, () => {
        isAuthenticated = true;
      });
      if (!isAuthenticated) return; // réponse envoyée par le middleware si non autorisé

      return await addCategory(req, res);
    }

    res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("Error in /api/categories:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
