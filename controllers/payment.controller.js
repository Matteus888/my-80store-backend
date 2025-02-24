const Order = require("../models/order.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Créer un paiement
const createPayment = async (req, res) => {
  const { publicId } = req.user;
  const { orderId, token } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Création d'une session de paiement avec Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.price * 100, // Conversion en centimes
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success`, // Redirigez après succès
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`, // Redirigez après annulation
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createPayment };
