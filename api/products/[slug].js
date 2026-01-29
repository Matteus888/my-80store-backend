import "../../config/connection.js";
import { getProductBySlug, updateProduct } from "../../controllers/product.controller.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    await getProductBySlug(req, res);
  } else if (req.method === "PUT") {
    await updateProduct(req, res);
  } else {
    res.setHeader("Allow", ["GET", "PUT", "OPTIONS"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
