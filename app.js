require("dotenv").config();
require("./config/connection");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index.routes");
const usersRouter = require("./routes/users.routes");
const productsRouter = require("./routes/products.routes");
const categoriesRouter = require("./routes/categories.routes");
const cartsRouter = require("./routes/cart.routes");
const ordersRouter = require("./routes/order.routes");
const paymentsRouter = require("./routes/payment.routes");

const app = express();

const cors = require("cors");

app.use(cookieParser());

// Activer CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-80store-frontend.vercel.app"],
    credentials: true, // Permet l'envoi des cookies avec la requête
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// Gérer les pré-requêtes CORS (OPTIONS)
app.options("*", cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "build")));

// Routes de l'API
app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);

// Routes Frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

module.exports = app;
