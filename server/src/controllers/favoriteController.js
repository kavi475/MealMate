import Favorite from "../models/Favorite.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  User
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId })
      .populate("menuItemId")
      .sort({ createdAt: -1 });

    // Filter out any favorites where menu item was deleted
    const validFavorites = favorites.filter((f) => f.menuItemId);

    // Return just the menu items
    const items = validFavorites.map((f) => f.menuItemId);

    res.json({
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add to favorites
// @route   POST /api/favorites/:menuItemId
// @access  User
export const addFavorite = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    // Check if item exists
    const item = await MenuItem.findById(menuItemId);
    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: req.userId,
      menuItemId,
    });

    if (existing) {
      return res.status(400).json({ error: "Already in favorites" });
    }

    await Favorite.create({
      userId: req.userId,
      menuItemId,
    });

    res.status(201).json({
      message: "Added to favorites",
      menuItemId,
    });
  } catch (error) {
    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: "Already in favorites" });
    }
    res.status(400).json({ error: error.message });
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/favorites/:menuItemId
// @access  User
export const removeFavorite = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const result = await Favorite.findOneAndDelete({
      userId: req.userId,
      menuItemId,
    });

    if (!result) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Toggle favorite
// @route   POST /api/favorites/toggle/:menuItemId
// @access  User
export const toggleFavorite = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const existing = await Favorite.findOne({
      userId: req.userId,
      menuItemId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({
        message: "Removed from favorites",
        isFavorite: false,
      });
    }

    const item = await MenuItem.findById(menuItemId);
    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    await Favorite.create({
      userId: req.userId,
      menuItemId,
    });

    res.json({
      message: "Added to favorites",
      isFavorite: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Check if item is favorited
// @route   GET /api/favorites/check/:menuItemId
// @access  User
export const checkFavorite = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const favorite = await Favorite.findOne({
      userId: req.userId,
      menuItemId,
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
