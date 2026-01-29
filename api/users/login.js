// /api/users/login.js

import "../../config/connection.js"; // ⚠️ IMPORTANT : ça initialise Mongoose
import { login } from "../../controllers/user.controller.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await login(req, res); // appelle ton controller qui utilise Mongoose
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
