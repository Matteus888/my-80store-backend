const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const addToCart = async (req, res) => {
  try {
    // const token = req.cookies.token;
    // if (!token) {
    //   return res.status(401).json({ message: "No token provided" });
    // }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const publicId = decoded.publicId;
    const { publicId, slug, quantity } = req.body;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
    }

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [{ product: product._id, quantity }] });
    } else {
      const existingItem = cart.items.find((item) => item.product.toString() === product._id.toString());

      if (existingItem) {
        const newQuantity = Number(existingItem.quantity) + Number(quantity);
        if (newQuantity > product.stock) {
          return res.status(400).json({ message: `You can't add more than ${product.stock} items to your cart` });
        }
        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({ product: product._id, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addToCart };
