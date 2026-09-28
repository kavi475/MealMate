import Order from "../models/Order.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  User
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      total,
      subtotal,
      deliveryCharge,
      deliveryAddress,
      estimatedDelivery,
      paymentMethod,
    } = req.body;

    // Validate
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    if (!total || !deliveryAddress) {
      return res.status(400).json({
        error: "Please provide total and delivery address",
      });
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;

    // Create order
    const order = await Order.create({
      orderId,
      userId: req.userId,
      items,
      total,
      subtotal: subtotal || total - (deliveryCharge || 40),
      deliveryCharge: deliveryCharge || 40,
      deliveryAddress,
      estimatedDelivery: estimatedDelivery || "15-20 minutes",
      paymentMethod: paymentMethod || "Card",
      status: "pending",
      paymentStatus: "paid",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  User
export const getUserOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.userId };

    if (status && status !== "all") {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  User
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.id,
      userId: req.userId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  User
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.id,
      userId: req.userId,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Can only cancel if not yet preparing
    if (["preparing", "ready", "delivered"].includes(order.status)) {
      return res.status(400).json({
        error: "Order cannot be cancelled at this stage",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ error: "Order already cancelled" });
    }

    order.status = "cancelled";
    order.paymentStatus = "refunded";
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [{ orderId: { $regex: search, $options: "i" } }];
    }

    const orders = await Order.find(filter)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      revenue: orders.reduce(
        (sum, o) => (o.status !== "cancelled" ? sum + o.total : sum),
        0,
      ),
    };

    res.json({ stats, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true },
    ).populate("userId", "name email phone");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
