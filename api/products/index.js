import common from "../_middlewares/common";
import "../../config/connection";

import { getProducts, getProductBySlug, createProduct, updateProduct } from "../../controllers/product.controller";

export default async function handler(req, res) {
  common(req, res);

  const { action, slug } = req.query;

  try {
    // GET /api/products
    if (req.method === "GET" && !action) {
      return await getProducts(req, res);
    }

    // GET /api/products?action=bySlug&slug=xxx
    if (req.method === "GET" && action === "bySlug") {
      req.params = { slug };
      return await getProductBySlug(req, res);
    }

    // POST /api/products?action=create
    if (req.method === "POST" && action === "create") {
      return await createProduct(req, res);
    }

    // PUT /api/products?action=update&slug=xxx
    if (req.method === "PUT" && action === "update") {
      req.params = { slug };
      return await updateProduct(req, res);
    }

    res.status(404).json({ message: "Route not found" });
  } catch (error) {
    console.error("Products API error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
