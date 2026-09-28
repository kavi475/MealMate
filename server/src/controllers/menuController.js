import MenuItem from "../models/MenuItem.js";

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res) => {
  try {
    const { category, search, veg } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (veg !== undefined && veg !== "") {
      filter.veg = veg === "true";
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });

    res.json({
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Admin
export const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      veg,
      image,
      prepTime,
      calories,
      rating,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({
        error: "Please provide name, description, price, category, and image",
      });
    }

    const item = await MenuItem.create({
      name,
      description,
      price,
      category,
      veg: veg !== undefined ? veg : true,
      image,
      prepTime: prepTime || "10-15 min",
      calories: calories || "300 kcal",
      rating: rating || 4.0,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Admin
export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Admin
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted successfully", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Toggle item availability
// @route   PUT /api/menu/:id/toggle
// @access  Admin
export const toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get popular items (top rated)
// @route   GET /api/menu/popular
// @access  Public
export const getPopularItems = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;

    // Get top-rated available items
    const items = await MenuItem.find({ isAvailable: true })
      .sort({ rating: -1 })
      .limit(limit);

    res.json({
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get category counts
// @route   GET /api/menu/categories/counts
// @access  Public
export const getCategoryCounts = async (req, res) => {
  try {
    const counts = await MenuItem.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const categoryCounts = {
      breakfast: 0,
      lunch: 0,
      snacks: 0,
      beverages: 0,
      desserts: 0,
    };

    counts.forEach((c) => {
      if (categoryCounts.hasOwnProperty(c._id)) {
        categoryCounts[c._id] = c.count;
      }
    });

    res.json({
      total: Object.values(categoryCounts).reduce((a, b) => a + b, 0),
      categories: categoryCounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
