import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  User
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  User
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, address },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  User
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Please provide both passwords" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users/admin/all
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    const stats = {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      users: users.filter((u) => u.role === "user").length,
    };

    res.json({ stats, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update user (Admin)
// @route   PUT /api/users/admin/:id
// @access  Admin
export const adminUpdateUser = async (req, res) => {
  try {
    const { name, phone, address, role } = req.body;

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ⭐ Prevent editing other admins (except yourself)
    if (user.role === "admin" && user._id.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "Cannot edit another admin account" });
    }

    // ⭐ Prevent changing role of an admin
    if (user.role === "admin" && role && role !== "admin") {
      return res.status(403).json({ error: "Cannot change admin role" });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/admin/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  try {
    // ⭐ Prevent self-deletion
    if (req.params.id === req.userId) {
      return res
        .status(403)
        .json({ error: "You cannot delete your own account" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ⭐ Prevent deleting other admins
    if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot delete admin accounts" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
