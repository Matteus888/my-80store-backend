const express = require("express");
// const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("dotenv").config();
require("../config/connection");

const indexRouter = require("../routes/index.routes");
const usersRouter = require("../routes/users.routes");
const productsRouter = require("../routes/products.routes");
const categoriesRouter = require("../routes/categories.routes");
const cartsRouter = require("../routes/cart.routes");
const ordersRouter = require("../routes/order.routes");
const paymentsRouter = require("../routes/payment.routes");

const app = express();

// === Middleware CORS compatible Vercel ===
const corsMiddleware = (req, res, next) => {
  const allowedOrigins = ["http://localhost:5173", "https://my-80store-frontend.vercel.app"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    // répondre immédiatement pour les preflight
    return res.status(200).end();
  }

  next();
};

app.use(corsMiddleware);
// const corsOptions = {
//   origin: ["http://localhost:5173", "https://my-80store-frontend.vercel.app"],
//   credentials: true,
//   methods: ["GET,POST,PUT,DELETE,OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);

module.exports = app;
