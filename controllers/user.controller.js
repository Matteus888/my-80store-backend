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
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
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

    const token = jwt.sign({ publicId: savedUser.publicId, email: savedUser.email, role: savedUser.role }, JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 jour
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        email: savedUser.email,
        publicId: savedUser.publicId,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Connexion
const login = async (req, res) => {
  const requiredFields = ["emailLog", "passwordLog"];
  if (!checkBody(req.body, requiredFields)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const { emailLog, passwordLog } = req.body;

  try {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${emailLog}$`, "i") } });
    if (!user) {
      return res.status(404).json({ message: "Can't find user in database." });
    }

    const isPasswordValid = bcrypt.compareSync(passwordLog, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ publicId: user.publicId, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 jour
    });

    res.status(200).json({
      message: "Login successful",
      user: { firstname: user.firstname, lastname: user.lastname, email: user.email, publicId: user.publicId, role: user.role },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Déconnexion
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Succefully logout" });
};

// Récupérer toutes les infos
const getInfos = async (req, res) => {
  try {
    const { publicId } = req.user;

    const user = await User.findOne({ publicId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting infos:", error);
    res.status(500).json("Server error");
  }
};

// Ajouter une adresse
const addAddress = async (req, res) => {
  const requiredFields = ["street", "city", "postalCode", "country"];
  if (!checkBody(req.body, requiredFields)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { publicId } = req.user;
    const { street, city, postalCode, country } = req.body;

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
    const { publicId } = req.user;

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
  const requiredFields = ["index", "street", "city", "postalCode", "country"];
  if (!checkBody(req.body, requiredFields)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { publicId } = req.user;
    const { index, street, city, postalCode, country } = req.body;

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
    const { publicId } = req.user;
    const { index } = req.body;

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

module.exports = { register, login, logout, getInfos, addAddress, getAddresses, updateAddress, removeAddress };
