import React from "react";
import { NavLink } from "react-router-dom";
import "../css/AdminDashboard.css";

export const AdminDashboard = () => {
  const stats = [
    {
      id: 1,
      label: "Total Orders",
      value: "1,247",
      icon: "📦",
      color: "#3b82f6",
      change: "+12%",
    },
    {
      id: 2,
      label: "Revenue",
      value: "₹2,48,900",
      icon: "💰",
      color: "#10b981",
      change: "+8%",
    },
    {
      id: 3,
      label: "Total Users",
      value: "1,892",
      icon: "👤",
      color: "#8b5cf6",
      change: "+5%",
    },
    {
      id: 4,
      label: "Menu Items",
      value: "48",
      icon: "🍽️",
      color: "#f97316",
      change: "+2",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-2024-009",
      customer: "Rahul Sharma",
      total: "₹497",
      status: "delivered",
      time: "2 min ago",
    },
    {
      id: "ORD-2024-008",
      customer: "Priya Patel",
      total: "₹249",
      status: "preparing",
      time: "10 min ago",
    },
    {
      id: "ORD-2024-007",
      customer: "Amit Kumar",
      total: "₹326",
      status: "confirmed",
      time: "25 min ago",
    },
    {
      id: "ORD-2024-006",
      customer: "Sneha Reddy",
      total: "₹179",
      status: "pending",
      time: "45 min ago",
    },
  ];

  const topItems = [
    { name: "Crispy Veg Burger", orders: 342, revenue: "₹68,058", icon: "🍔" },
    { name: "Paneer Tikka Pizza", orders: 287, revenue: "₹71,463", icon: "🍕" },
    { name: "Masala Dosa", orders: 245, revenue: "₹31,605", icon: "🥞" },
    { name: "Chicken Tikka Roll", orders: 198, revenue: "₹35,442", icon: "🌯" },
  ];

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

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">📊 Admin Dashboard</h1>
            <p className="page-subtitle">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <NavLink to="/admin/menu" className="btn btn-primary">
            ➕ Add New Item
          </NavLink>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <span className="stat-change">
                  {stat.change} from last month
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>📋 Recent Orders</h2>
              <NavLink to="/admin/orders" className="view-all">
                View All →
              </NavLink>
            </div>
            <div className="orders-list">
              {recentOrders.map((order) => (
                <div key={order.id} className="order-row">
                  <div className="order-info">
                    <span className="order-id">{order.id}</span>
                    <span className="order-customer">{order.customer}</span>
                  </div>
                  <div className="order-meta">
                    <span className="order-total">{order.total}</span>
                    <span
                      className="order-status"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      ● {order.status}
                    </span>
                    <span className="order-time">{order.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>🔥 Top Selling Items</h2>
              <NavLink to="/admin/reports" className="view-all">
                Reports →
              </NavLink>
            </div>
            <div className="top-items-list">
              {topItems.map((item, index) => (
                <div key={index} className="top-item-row">
                  <span className="item-rank">#{index + 1}</span>
                  <span className="item-icon">{item.icon}</span>
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-orders">{item.orders} orders</span>
                  </div>
                  <span className="item-revenue">{item.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

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
