const Product = require("../models/product.model");
const Category = require("../models/category.model");
const slugify = require("slugify");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryIds, stock, imageUrl } = req.body;

    if (!name || !description || !price || !categoryIds || !stock) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    const categories = await Category.find({ _id: { $in: categoryIds } });
    if (categories.length !== categoryIds.length) {
      return res.status(404).json({ message: "One or more categories not found" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      stock,
      category: categoryIds,
      slug: slugify(name, { lower: true, strict: true }),
    });
    await newProduct.save();

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createProduct };
