const Order = require("../models/order.model");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Payment = require("../models/payment.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Créer un paiement
const createPayment = async (req, res) => {
  const { publicId } = req.user;
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Récupérer les infos des produits
    const lineItems = [];
    for (let item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      });
    }

    // Création d'une session de paiement avec Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`, // Redirigez après succès
      cancel_url: `${process.env.CLIENT_URL}/PaymentCancel`, // Redirigez après annulation
    });

    // Enregistrement du paiement dans la base de données
    const payment = new Payment({
      order: orderId,
      paymentMethod: "credit_card", // Tu peux ajouter d'autres méthodes si nécessaire
      paymentStatus: "pending",
      transactionId: session.id, // Id de la session Stripe
    });

    await payment.save();

    res.status(200).json({ id: session.id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Vérifier un paiement
const verifyPayment = async (req, res) => {
  const { sessionId } = req.params;
  const { publicId } = req.user;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      const payment = await Payment.findOneAndUpdate({ transactionId: sessionId }, { paymentStatus: "completed" }, { new: true });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      const order = await Order.findById(payment.order).populate("items.product");
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      order.status = "paid";
      await order.save();

      const user = await User.findOne({ publicId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.orders.includes(order._id)) {
        user.orders.push(order._id);
        await user.save();
      } else {
        console.warn("Order already exists in user orders:", order._id);
      }

      const cart = await Cart.findOne({ user: user._id });
      if (cart) {
        await Cart.deleteOne({ _id: cart._id });
      } else {
        console.error("Cart not found for user:", user._id);
      }

      return res.status(200).json({ status: "paid", payment, order });
    } else {
      return res.status(400).json({ status: "failed" });
    }
  } catch (error) {
    console.error("Error verifying payment session:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createPayment, verifyPayment };
