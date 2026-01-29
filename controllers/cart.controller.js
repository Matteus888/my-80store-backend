const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

// Récupérer le panier
const getCart = async (req, res) => {
  try {
    const publicId = req.user.publicId;

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
    const { slug } = req.body;
    const publicId = req.user.publicId;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < 1) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({
        user: user._id,
        items: [{ product: product._id, quantity: 1, price: product.price }],
        totalPrice: product.price,
      });
    } else {
      const existingItem = cart.items.find((item) => item.product.toString() === product._id.toString());

      if (existingItem) {
        if (existingItem.quantity + 1 > product.stock) {
          return res
            .status(400)
            .json({ message: `You can't add more than ${product.stock} items to your cart. Insufficient stock.` });
        }
        existingItem.quantity += 1;
      } else {
        cart.items.push({ product: product._id, quantity: 1, price: product.price });
      }
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate("items.product");
    res.status(200).json({ message: "Product added to cart", cart: populatedCart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mettre à jour le nombre d'un article dans le panier
const updateCartItem = async (req, res) => {
  try {
    const { slug, quantity } = req.body;
    const publicId = req.user.publicId;
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

    const cart = await Cart.findOne({ user: user._id }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.product._id.toString() === product._id.toString());
    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.quantity = newQuantity;
    item.price = product.price;

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Error during updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Faire la même commande
const reorder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const user = await User.findOne({ publicId: req.user.publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await Order.findOne({ _id: orderId }).populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const userCart =
      (await Cart.findOne({ user: user._id })) ||
      new Cart({
        user: user._id,
        items: [],
        totalPrice: 0,
      });

    order.items.forEach((orderItem) => {
      const existingItem = userCart.items.find(
        (cartItem) => cartItem.product.toString() === orderItem.product._id.toString(),
      );
      if (existingItem) {
        existingItem.quantity += orderItem.quantity;
      } else {
        userCart.items.push({
          product: orderItem.product._id,
          quantity: orderItem.quantity,
          price: orderItem.product.price,
        });
      }
    });

    userCart.totalPrice = userCart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    await userCart.save();
    res.status(200).json({ message: "Reorder successful" });
  } catch (error) {
    console.error("Error during reorder:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Enlever un produit du panier
const removeFromCart = async (req, res) => {
  try {
    const publicId = req.user.publicId;
    const { slug } = req.query;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOne({ user: user._id }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.product._id.toString() !== product._id.toString());

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (cart.items.length === 0) {
      await Cart.deleteOne({ _id: cart._id });
      return res.status(200).json({ message: "Cart is now empty", items: [], totalPrice: 0 });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

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
    const publicId = req.user.publicId;

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

module.exports = { getCart, addToCart, updateCartItem, reorder, removeFromCart, clearCart };
