import connectDB from "../../config/connection.js";
import common from "../_middlewares/common.js";
import { authenticate } from "../../middlewares/auth.js";

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
  // CORS
  if (common(req, res)) return;

  await connectDB();

  const { action } = req.query;

  try {
    // -------- PUBLIC --------
    if (req.method === "POST" && action === "login") {
      return await login(req, res);
    }

    if (req.method === "POST" && action === "register") {
      return await register(req, res);
    }

    if (req.method === "POST" && action === "logout") {
      return await logout(req, res);
    }

    // -------- AUTH REQUIRED --------
    const isAuth = await authenticate(req);
    if (!isAuth) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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

    return res.status(404).json({ message: "Route not found" });
  } catch (error) {
    console.error("Users API error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
