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
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);
app.use("/payments", paymentsRouter);

module.exports = app;
