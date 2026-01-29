import "../../config/connection.js";
import { getInfos } from "../../controllers/user.controller.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://my-80store-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    await getInfos(req, res);
  } else {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
