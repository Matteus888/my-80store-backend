import "../../config/connection.js";
import { getProducts, createProduct } from "../../controllers/product.controller.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    await getProducts(req, res);
  } else if (req.method === "POST") {
    await createProduct(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
