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

app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-80store-frontend.vercel.app"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy-Report-Only", // Utilisez Report-Only pour déboguer sans bloquer
    "default-src 'self'; " +
      "font-src 'self' https://js.stripe.com https://fonts.gstatic.com data:; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://api.stripe.com https://js.stripe.com;"
  );
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);
app.use("/payments", paymentsRouter);

// Si tu application est une Single Page Application, cette ligne redirige vers ton index HTML
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

module.exports = app;
