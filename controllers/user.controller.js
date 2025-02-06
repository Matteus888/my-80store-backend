const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { checkBody } = require("../middlewares/checkBody");

const JWT_SECRET = process.env.JWT_SECRET;

// Inscription
const register = async (req, res) => {
  const requiredFields = ["firstname", "lastname", "email", "password"];
  if (!checkBody(req.body, requiredFields)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const { firstname, lastname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "This user already exists" });
    }

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ publicId: savedUser.publicId, email: savedUser.email, role: savedUser.role }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 heure
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { firstname: savedUser.firstname, lastname: savedUser.lastname, email: savedUser.email, publicId: savedUser.publicId },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Connexion
const login = async (req, res) => {
  const requiredFields = ["email", "password"];
  if (!checkBody(req.body, requiredFields)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Can't find user in database." });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ publicId: user.publicId, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 heure
    });

    res.status(200).json({
      message: "Login successful",
      user: { firstname: user.firstname, lastname: user.lastname, email: user.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Ajouter une adresse
const addAddress = async (req, res) => {
  const requiredFields = ["street", "city", "postalCode", "country"];
  if (!checkBody(req.body, requiredFields)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { publicId, street, city, postalCode, country } = req.body;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push({ street, city, postalCode, country });

    await user.save();
    res.status(200).json({ message: "Address added successfully", user });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json("Server error");
  }
};

// Récupérer toutes les adresses
const getAddresses = async (req, res) => {
  try {
    const { publicId } = req.body;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Error getting addresses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mettre à jour une adresse
const updateAddress = async (req, res) => {
  // Un doute sur index
  const requiredFields = ["index", "street", "city", "postalCode", "country"];
  if (!checkBody(req.body, requiredFields)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { publicId, index, street, city, postalCode, country } = req.body;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.addresses[index]) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses[index] = { street, city, postalCode, country };

    await user.save();
    res.status(200).json({ message: "Address updated successfully", user });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Supprimer une adresse
const removeAddress = async (req, res) => {
  try {
    const { publicId, index } = req.body;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.addresses[index]) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses.splice(index, 1);

    await user.save();
    res.status(200).json({ message: "Address removed successfully", user });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, addAddress, getAddresses, updateAddress, removeAddress };
