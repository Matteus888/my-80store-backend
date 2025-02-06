const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Récupérer le panier
const getCart = async (req, res) => {
  try {
    const { publicId } = req.body;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ user: user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Cart is empty", cart: { items: [] } });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Ajouter un produit au panier
const addToCart = async (req, res) => {
  try {
    // const token = req.cookies.token;
    // if (!token) {
    //   return res.status(401).json({ message: "No token provided" });
    // }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const publicId = decoded.publicId;
    const { publicId, slug } = req.body;
    const quantity = parseInt(req.body.quantity, 10);

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a valid number greater than 0" });
    }

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
    }

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({
        user: user._id,
        items: [{ product: product._id, quantity, price: product.price }],
      });
    } else {
      const existingItem = cart.items.find((item) => item.product.toString() === product._id.toString());

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          return res.status(400).json({ message: `You can't add more than ${product.stock} items to your cart` });
        }
        existingItem.quantity = newQuantity;
        existingItem.price = product.price;
      } else {
        cart.items.push({ product: product._id, quantity, price: product.price });
      }
    }

    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    cart.totalPrice = totalPrice;

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mettre à jour le nombre d'un article dans le panier
const updateCartItem = async (req, res) => {
  try {
    const { publicId, slug, quantity } = req.body;
    const newQuantity = parseInt(quantity, 10);

    if (isNaN(newQuantity) || newQuantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a valid number greater than 0" });
    }

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (newQuantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} items available in stock` });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.product.toString() === product._id.toString());
    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.quantity = newQuantity;
    item.price = product.price;

    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    cart.totalPrice = totalPrice;

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Error during updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Enlever un produit du panier
const removeFromCart = async (req, res) => {
  try {
    const { publicId } = req.body;
    const { slug } = req.params;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const updatedItems = cart.items.filter((item) => item.product.toString() !== product._id.toString());
    if (updatedItems.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({ message: "Cart is now empty" });
    }
    cart.items = updatedItems;

    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    cart.totalPrice = totalPrice;

    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Vider le panier
const clearCart = async (req, res) => {
  try {
    const { publicId } = req.body;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart already empty" });
    }

    await Cart.deleteOne({ _id: cart._id });
    res.status(200).json({ message: "Cart has been emptied" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
