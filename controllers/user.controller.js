const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { checkBody } = require("../modules/checkBody");

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
      user: { firstname: savedUser.firstname, lastname: savedUser.lastname, email: savedUser.email },
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

module.exports = { register, login };
