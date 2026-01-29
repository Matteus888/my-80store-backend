import connectDB from "../../config/connection.js";
import common from "../_middlewares/common.js";
import { getProducts, getProductBySlug, createProduct, updateProduct } from "../../controllers/product.controller.js";

export default async function handler(req, res) {
  common(req, res);
  await connectDB();

  const { action, slug } = req.query;

  try {
    if (req.method === "GET" && !action) return getProducts(req, res);
    if (req.method === "GET" && action === "bySlug") {
      req.params = { slug };
      return getProductBySlug(req, res);
    }
    if (req.method === "POST" && action === "create") return createProduct(req, res);
    if (req.method === "PUT" && action === "update") {
      req.params = { slug };
      return updateProduct(req, res);
    }

    res.status(404).json({ message: "Route not found" });
  } catch (err) {
    console.error("Products API error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
