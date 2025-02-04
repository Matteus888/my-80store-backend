const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false } // On empêche la génération d'un champ _id pour chaque sous-document
);

const userSchema = new Schema(
  {
    publicId: { type: String, default: uuidv4, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: [addressSchema],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    orders: [{ type: mongoose.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true } // Génère automatiquement createdAt et updatedAt
);

const User = mongoose.model("User", userSchema);
module.exports = User;
