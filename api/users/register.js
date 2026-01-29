import "../../config/connection.js";
import { register } from "../../controllers/user.controller.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await register(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
