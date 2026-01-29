// /api/products/index.js
import connectDB from "../../config/connection.js";
import { authenticate } from "../../middlewares/auth.js"; // middleware auth si besoin
import { getProducts, getProductBySlug, createProduct, updateProduct } from "../../controllers/product.controller.js";

export default async function handler(req, res) {
  // ⚡ CORS pour le front
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  await connectDB();

  const { action, slug } = req.query;
  if (slug) req.params = { slug }; // pour getProductBySlug et updateProduct

  try {
    // GET /api/products
    if (req.method === "GET" && !action) {
      return await getProducts(req, res);
    }

    // GET /api/products?action=bySlug&slug=xxx
    if (req.method === "GET" && action === "bySlug") {
      return await getProductBySlug(req, res);
    }

    // 💳 Routes protégées : création ou mise à jour
    if (req.method === "POST" && action === "create") {
      await authenticate()(req, res, async () => {
        return await createProduct(req, res);
      });
      return;
    }

    if (req.method === "PUT" && action === "update") {
      await authenticate()(req, res, async () => {
        return await updateProduct(req, res);
      });
      return;
    }

    res.status(404).json({ message: "Route not found" });
  } catch (error) {
    console.error("Products API error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
