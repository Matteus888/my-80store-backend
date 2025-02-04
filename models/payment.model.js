const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    order: { type: mongoose.Types.ObjectId, ref: "Order", required: true },
    paymentMethod: { type: String, enum: ["credit_card", "paypal", "bank_transfer"], required: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transactionId: { type: String }, // Id unique du prestataire de paiement
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
