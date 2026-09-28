import User from "../models/User.js";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
export const getDashboardStats = async (req, res) => {
  try {
    //  BASIC COUNTS 
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalMenuItems = await MenuItem.countDocuments();
    const activeMenuItems = await MenuItem.countDocuments({
      isAvailable: true,
    });

    //  REVENUE 
    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    //  ORDER STATUS BREAKDOWN 
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
    };

    statusBreakdown.forEach((item) => {
      if (statusCounts.hasOwnProperty(item._id)) {
        statusCounts[item._id] = item.count;
      }
    });

    //  RECENT ORDERS 
    const recentOrders = await Order.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .limit(5);

    //  TOP SELLING ITEMS 
    const topItems = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalOrders: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          image: { $first: "$items.image" },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 4 },
    ]);

    //  TODAY'S STATS 
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: { $ne: "cancelled" },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const todayRevenueTotal = todayRevenue[0]?.total || 0;

    //  RESPONSE 
    res.json({
      stats: {
        totalOrders,
        totalUsers,
        totalMenuItems,
        activeMenuItems,
        totalRevenue,
        todayOrders,
        todayRevenue: todayRevenueTotal,
      },
      statusCounts,
      recentOrders,
      topItems,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get sales report by range
// @route   GET /api/admin/reports?range=week
// @access  Admin
export const getSalesReport = async (req, res) => {
  try {
    const range = req.query.range || "week";
    const now = new Date();
    let startDate;
    let groupBy;
    let labelFormat;

    // Determine date range and grouping
    if (range === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      groupBy = { $dayOfWeek: "$createdAt" };
      labelFormat = "day";
    } else if (range === "month") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 27);
      startDate.setHours(0, 0, 0, 0);
      groupBy = {
        year: { $year: "$createdAt" },
        week: { $week: "$createdAt" },
      };
      labelFormat = "week";
    } else {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 11);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
      labelFormat = "month";
    }

    // Aggregate sales data
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: groupBy,
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format data for chart
    const formattedData = salesData.map((item) => {
      let label = "";

      if (labelFormat === "day") {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        label = days[item._id - 1] || "N/A";
      } else if (labelFormat === "week") {
        label = `Week ${item._id.week}`;
      } else {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        label = months[item._id.month - 1] || "N/A";
      }

      return {
        label,
        orders: item.orders,
        revenue: item.revenue,
      };
    });

    // Calculate totals
    const totalRevenue = formattedData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = formattedData.reduce((sum, d) => sum + d.orders, 0);
    const avgOrderValue =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    res.json({
      range,
      chartData: formattedData,
      summary: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
      },
    });
  } catch (error) {
    console.error("Sales report error:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get category breakdown
// @route   GET /api/admin/reports/categories
// @access  Admin
export const getCategoryBreakdown = async (req, res) => {
  try {
    // Get menu items with categories
    const menuItems = await MenuItem.find().select("_id category");
    const itemCategoryMap = {};
    menuItems.forEach((item) => {
      itemCategoryMap[item._id.toString()] = item.category;
    });

    // Aggregate order items by category
    const orders = await Order.find({ status: { $ne: "cancelled" } });

    const categoryStats = {
      breakfast: { orders: 0, revenue: 0 },
      lunch: { orders: 0, revenue: 0 },
      snacks: { orders: 0, revenue: 0 },
      beverages: { orders: 0, revenue: 0 },
      desserts: { orders: 0, revenue: 0 },
    };

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const category = itemCategoryMap[item.menuItemId?.toString()];
        if (category && categoryStats[category]) {
          categoryStats[category].orders += item.quantity;
          categoryStats[category].revenue += item.price * item.quantity;
        }
      });
    });

    // Calculate total revenue for percentage
    const totalRevenue = Object.values(categoryStats).reduce(
      (sum, c) => sum + c.revenue,
      0,
    );

    // Build response with percentage + colors
    const colors = {
      snacks: "#f97316",
      lunch: "#3b82f6",
      breakfast: "#8b5cf6",
      beverages: "#06b6d4",
      desserts: "#10b981",
    };

    const result = Object.entries(categoryStats).map(([name, data]) => ({
      category: name.charAt(0).toUpperCase() + name.slice(1),
      orders: data.orders,
      revenue: data.revenue,
      percentage:
        totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
      color: colors[name],
    }));

    res.json({ categories: result });
  } catch (error) {
    console.error("Category breakdown error:", error);
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get top customers
// @route   GET /api/admin/reports/customers
// @access  Admin
export const getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: "$userId",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          name: "$user.name",
          email: "$user.email",
          totalOrders: 1,
          totalSpent: 1,
        },
      },
    ]);

    res.json({ customers: topCustomers });
  } catch (error) {
    console.error("Top customers error:", error);
    res.status(500).json({ error: error.message });
  }
};
