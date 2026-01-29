import connectDB from "../../config/connection.js";
import common from "../_middlewares/common.js";
import { getCategories, addCategory } from "../../controllers/category.controller.js";

export default async function handler(req, res) {
  common(req, res);
  await connectDB();

  try {
    if (req.method === "GET") return getCategories(req, res);
    if (req.method === "POST") return addCategory(req, res);

    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("Categories API error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
