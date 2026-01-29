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
  common(req, res);
  await connectDB();

  const { action } = req.query;

  try {
    // PUBLIC ROUTES
    if (req.method === "POST" && action === "login") return login(req, res);
    if (req.method === "POST" && action === "register") return register(req, res);
    if (req.method === "POST" && action === "logout") return logout(req, res);

    // PROTECTED ROUTES
    const isAuth = await authenticate(req, res);
    if (!isAuth) return;

    if (req.method === "GET" && action === "me") return getInfos(req, res);
    if (req.method === "GET" && action === "addresses") return getAddresses(req, res);
    if (req.method === "POST" && action === "address") return addAddress(req, res);
    if (req.method === "PUT" && action === "address") return updateAddress(req, res);
    if (req.method === "DELETE" && action === "address") return removeAddress(req, res);

    res.status(404).json({ message: "Route not found" });
  } catch (err) {
    console.error("Users API error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
