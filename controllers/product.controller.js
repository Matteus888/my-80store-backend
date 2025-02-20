const Product = require("../models/product.model");
const Category = require("../models/category.model");

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

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    let products = Product.find(query).skip(skip).limit(limit);

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

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      products: await products,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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

// Créer un produit
const createProduct = async (req, res) => {
  try {
    const { name, brand, description, price, category, stock, imageUrls } = req.body;

    if (!name || !brand || !description || !price || !stock) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    if (!Array.isArray(category) || category.length === 0) {
      return res.status(400).json({ message: "Category should be an array." });
    }

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ message: "At least one image URL is required." });
    }

    const existingCategories = await Category.find({ slug: { $in: category } });
    if (existingCategories.length !== category.length) {
      return res.status(404).json({ message: "One or more categories not found" });
    }

    const newProduct = new Product({
      name,
      brand,
      description,
      price,
      imageUrls,
      stock,
      category,
    });
    await newProduct.save();

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mettre à jour un produit avec son slug
const updateProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const { stock, description, price, imageUrls } = req.body;

    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (stock !== undefined) product.stock = stock;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;

    if (imageUrls !== undefined) {
      if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        return res.status(400).json({ message: "At least one image URL is required." });
      }
      product.imageUrls = imageUrls;
    }

    await product.save();

    res.status(200).json({ message: "Product successfully updated" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProductBySlug, getProducts, createProduct, updateProduct };
