import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create user with address
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address: address || {},
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reset password (requires current password)
export const resetPassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters." });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({
        error: "New password must be different from your current password.",
      });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid email or current password." });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Invalid email or current password." });
    }

    // updateOne skips the pre-save hook, so we hash manually (hashed only once)
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ _id: user._id }, { $set: { password: hashed } });

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again." });
  }
};
