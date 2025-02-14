const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    category: [{ type: String, required: true }],
    stock: { type: Number, required: true, min: 0 },
    imageUrls: [{ type: String, required: true }],
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
