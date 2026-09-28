import Cart from "../models/Cart.js";

// @desc    Get user's cart
// @route   GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = await Cart.create({ userId: req.userId, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
export const addToCart = async (req, res) => {
  try {
    const { menuItemId, name, price, image, quantity = 1 } = req.body;

    if (!menuItemId || !name || !price) {
      return res.status(400).json({ error: "Missing item details" });
    }

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = await Cart.create({ userId: req.userId, items: [] });
    }

    // Check if item already exists
    const existingIndex = cart.items.findIndex(
      (item) => item.menuItemId.toString() === menuItemId,
    );

    if (existingIndex > -1) {
      // Update quantity
      cart.items[existingIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ menuItemId, name, price, image, quantity });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/update
export const updateCartItem = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || quantity === undefined) {
      return res.status(400).json({ error: "Missing item details" });
    }

    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.menuItemId.toString() === menuItemId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not in cart" });
    }

    if (quantity < 1) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:menuItemId
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.menuItemId.toString() !== req.params.menuItemId,
    );

    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (cart) {
      cart.items = [];
      cart.updatedAt = Date.now();
      await cart.save();
    }

    res.json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
