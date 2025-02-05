const Product = require("../models/product.model");
const Category = require("../models/category.model");
const slugify = require("slugify");

// Récupérer un produit avec son slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Récupérer tous les produits (filtres possibles)
const getProducts = async (req, res) => {
  try {
    let query = {};

    // Filtrer par catégorie
    if (req.query.category) {
      query.category = { $in: req.query.category.split(",") };
    }

    // Filtrer par prix minimum et/ou maximum
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice); // $gte supérieur ou égal
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice); // $lte inférieur ou égal
    }

    let products = Product.find(query);

    // Si paramètre sort
    if (req.query.sort) {
      const sortOptions = {
        price_asc: { price: 1 },
        price_desc: { price: -1 },
        name_asc: { name: 1 },
        name_desc: { name: -1 },
      };
      products = products.sort(sortOptions[req.query.sort] || {});
    }
    res.status(200).json(await products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Créer un produit
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    const existingCategories = await Category.find({ slug: { $in: category } });
    if (existingCategories.length !== category.length) {
      return res.status(404).json({ message: "One or more categories not found" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      stock,
      category,
      slug: slugify(name, { lower: true, strict: true }),
    });
    await newProduct.save();

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProductBySlug, getProducts, createProduct };
