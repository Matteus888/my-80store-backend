const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("dotenv").config();
require("./config/connection");

const indexRouter = require("./routes/index.routes");
const usersRouter = require("./routes/users.routes");
const productsRouter = require("./routes/products.routes");
const categoriesRouter = require("./routes/categories.routes");
const cartsRouter = require("./routes/cart.routes");
const ordersRouter = require("./routes/order.routes");
const paymentsRouter = require("./routes/payment.routes");

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://my-80store-frontend.vercel.app"],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/carts", cartsRouter);
app.use("/orders", ordersRouter);
app.use("/payments", paymentsRouter);

module.exports = app;
