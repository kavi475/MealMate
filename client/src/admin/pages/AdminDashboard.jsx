import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import api from "../../utils/api";
import "../css/AdminDashboard.css";

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/dashboard");
      setData(response.data);
      setError("");
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.response?.data?.error || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      confirmed: "#3b82f6",
      preparing: "#8b5cf6",
      ready: "#06b6d4",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      confirmed: "✅",
      preparing: "👨‍🍳",
      ready: "📦",
      delivered: "🚚",
      cancelled: "❌",
    };
    return icons[status] || "📋";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-container">
          <div className="error-state">
            <div className="error-icon">😢</div>
            <h3>Failed to load dashboard</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchDashboard}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { stats, statusCounts, recentOrders, topItems } = data;

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="page-title">📊 Admin Dashboard</h1>
            <p className="page-subtitle">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={fetchDashboard}>
            🔄 Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: "#3b82f615", color: "#3b82f6" }}
            >
              📦
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Orders</p>
              <h3 className="stat-value">{stats.totalOrders}</h3>
              <span className="stat-change">{stats.todayOrders} today</span>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: "#10b98115", color: "#10b981" }}
            >
              💰
            </div>
            <div className="stat-content">
              <p className="stat-label">Revenue</p>
              <h3 className="stat-value">
                ₹{stats.totalRevenue.toLocaleString()}
              </h3>
              <span className="stat-change">
                ₹{stats.todayRevenue.toLocaleString()} today
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: "#8b5cf615", color: "#8b5cf6" }}
            >
              👤
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Users</p>
              <h3 className="stat-value">{stats.totalUsers}</h3>
              <span className="stat-change">Registered customers</span>
            </div>
          </div>

          <div className="stat-card">
            <div
              className="stat-icon"
              style={{ backgroundColor: "#f9731615", color: "#f97316" }}
            >
              🍽️
            </div>
            <div className="stat-content">
              <p className="stat-label">Menu Items</p>
              <h3 className="stat-value">{stats.totalMenuItems}</h3>
              <span className="stat-change">
                {stats.activeMenuItems} available
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📈 Order Status Breakdown</h2>
            <NavLink to="/admin/orders" className="view-all">
              Manage Orders →
            </NavLink>
          </div>
          <div className="status-breakdown">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="status-item">
                <span
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor(status) }}
                ></span>
                <span className="status-name">
                  {getStatusIcon(status)}{" "}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Recent Orders */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>📋 Recent Orders</h2>
              <NavLink to="/admin/orders" className="view-all">
                View All →
              </NavLink>
            </div>
            {recentOrders.length > 0 ? (
              <div className="orders-list">
                {recentOrders.map((order) => (
                  <div key={order._id} className="order-row">
                    <div className="order-info">
                      <span className="order-id">{order.orderId}</span>
                      <span className="order-customer">
                        {order.userId?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="order-meta">
                      <span className="order-total">₹{order.total}</span>
                      <span
                        className="order-status"
                        style={{ color: getStatusColor(order.status) }}
                      >
                        ● {order.status}
                      </span>
                      <span className="order-time">
                        {formatTime(order.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-dashboard">
                <p>No orders yet</p>
              </div>
            )}
          </div>

          {/* Top Selling Items */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>🔥 Top Selling Items</h2>
              <NavLink to="/admin/reports" className="view-all">
                Reports →
              </NavLink>
            </div>
            {topItems.length > 0 ? (
              <div className="top-items-list">
                {topItems.map((item, index) => (
                  <div key={index} className="top-item-row">
                    <span className="item-rank">#{index + 1}</span>
                    <img
                      src={item.image}
                      alt={item._id}
                      className="item-thumb-sm"
                      onError={(e) => {
                        e.target.style.display = "none";
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = "flex";
                        }
                      }}
                    />
                    <span className="item-emoji-sm" style={{ display: "none" }}>
                      🍽️
                    </span>
                    <div className="item-info">
                      <span className="item-name">{item._id}</span>
                      <span className="item-orders">
                        {item.totalOrders} orders
                      </span>
                    </div>
                    <span className="item-revenue">
                      ₹{item.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-dashboard">
                <p>No sales data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>⚡ Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            <NavLink to="/admin/menu" className="quick-action-card">
              <span className="qa-icon">🍽️</span>
              <span className="qa-label">Menu Management</span>
              <span className="qa-desc">Add, edit, delete items</span>
            </NavLink>
            <NavLink to="/admin/orders" className="quick-action-card">
              <span className="qa-icon">📦</span>
              <span className="qa-label">Order Management</span>
              <span className="qa-desc">Track and update orders</span>
            </NavLink>
            <NavLink to="/admin/users" className="quick-action-card">
              <span className="qa-icon">👥</span>
              <span className="qa-label">User Management</span>
              <span className="qa-desc">View and manage users</span>
            </NavLink>
            <NavLink to="/admin/reports" className="quick-action-card">
              <span className="qa-icon">📊</span>
              <span className="qa-label">Reports</span>
              <span className="qa-desc">Sales and analytics</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
