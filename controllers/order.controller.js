const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");

// Créer une commande
const createOrder = async (req, res) => {
  try {
    const { publicId } = req.user;
    const { shippingAddressIndex } = req.body;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const shippingAddress = user.addresses[shippingAddressIndex];
    if (!shippingAddress) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });

    const newOrderData = {
      user: user._id,
      items: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      shippingAddress: shippingAddressIndex,
      status: "pending",
    };

    let existingOrder = await Order.findOne({ user: user._id, status: "pending" });
    if (existingOrder) {
      existingOrder.items = newOrderData.items;
      existingOrder.totalPrice = newOrderData.totalPrice;
      existingOrder.shippingAddress = newOrderData.shippingAddress;

      await existingOrder.save();
      return res.status(200).json({ message: "Order updated successfully", order: existingOrder });
    }

    const newOrder = new Order(newOrderData);

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Récupérer une commande spécifique
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const user = await User.findById(order.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const shippingAddress = user.addresses[order.shippingAddress];

    const customerInfo = {
      name: user.firstname + " " + user.lastname,
      email: user.email,
      address: shippingAddress,
    };

    res.status(200).json({ order, customerInfo });
  } catch (error) {
    console.error("Error getting this order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Récupérer toutes les commandes d'un utilisateur
const getAllMyOrders = async (req, res) => {
  const { publicId } = req.user;

  try {
    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const paidOrders = await Order.find({ user: user._id, status: "paid" })
      .populate({ path: "items.product", select: "name brand price" })
      .sort({ createdAt: -1 });

    if (!paidOrders.length) {
      return res.status(404).json({ message: "No paid orders found" });
    }

    res.status(200).json({ orders: paidOrders });
  } catch (error) {
    console.error("Error getting paid orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Annuler une commande
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to cancel this order" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    order.status = "cancelled";

    await order.save();
    res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    console.error("Error cancelling this order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Marquer une commande comme payée
const markOrderAsPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to mark this order as paid" });
    }

    if (order.status === "paid") {
      return res.status(400).json({ message: "Order is already marked as paid" });
    }

    order.status = "paid";

    await order.save();
    res.status(200).json({ message: "Order marked as paid", order });
  } catch (error) {
    console.error("Error making order as paid:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mettre à jour le status d'une commande
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const transitions = {
      pending: ["paid", "cancelled"],
      paid: ["shipped", "cancelled"],
      shipped: ["delivered"],
    };

    if (order.status !== status && !transitions[order.status]?.includes(status)) {
      return res.status(400).json({ message: `Cannot change status from ${order.status} to ${status}` });
    }

    order.status = status;

    await order.save();
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating this order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, getAllMyOrders, getOrderById, cancelOrder, updateOrderStatus, markOrderAsPaid };
