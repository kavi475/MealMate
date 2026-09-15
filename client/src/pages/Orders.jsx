import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/Orders.css";

export const Orders = () => {
  const [filterStatus, setFilterStatus] = useState("all");

  // ✅ Static Order Data
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      items: [
        { name: "Crispy Veg Cheese Burger", quantity: 2, price: 199 },
        { name: "French Fries", quantity: 1, price: 99 },
      ],
      total: 497,
      status: "delivered",
      payment: "Paid",
      estimatedDelivery: "2024-01-15 14:30",
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-16",
      items: [
        { name: "Paneer Tikka Pizza", quantity: 1, price: 249 },
        { name: "Cold Coffee", quantity: 2, price: 89 },
      ],
      total: 427,
      status: "preparing",
      payment: "Paid",
      estimatedDelivery: "2024-01-16 13:15",
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-14",
      items: [
        { name: "Chicken Tikka Roll", quantity: 1, price: 179 },
        { name: "Samosa", quantity: 3, price: 49 },
      ],
      total: 326,
      status: "cancelled",
      payment: "Refunded",
      estimatedDelivery: "N/A",
    },
    {
      id: "ORD-2024-004",
      date: "2024-01-17",
      items: [
        { name: "Special Masala Dosa", quantity: 2, price: 129 },
        { name: "Gulab Jamun", quantity: 2, price: 79 },
      ],
      total: 416,
      status: "confirmed",
      payment: "Pending",
      estimatedDelivery: "2024-01-17 12:45",
    },
  ];

  // Status options
  const statusOptions = [
    { id: "all", label: "All Orders", icon: "📋" },
    { id: "pending", label: "Pending", icon: "⏳" },
    { id: "confirmed", label: "Confirmed", icon: "✅" },
    { id: "preparing", label: "Preparing", icon: "👨‍🍳" },
    { id: "ready", label: "Ready", icon: "📦" },
    { id: "delivered", label: "Delivered", icon: "🚚" },
    { id: "cancelled", label: "Cancelled", icon: "❌" },
  ];

  // Filter orders
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  // Status color mapping
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

  // Status label mapping
  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Status icon mapping
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

  return (
    <div className="orders-page">
      <div className="container">
        {/* Page Header */}
        <div className="orders-header">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Status Filters */}
        <div className="orders-filters">
          {statusOptions.map((option) => (
            <button
              key={option.id}
              className={`filter-btn ${filterStatus === option.id ? "active" : ""}`}
              onClick={() => setFilterStatus(option.id)}
            >
              <span className="filter-icon">{option.icon}</span>
              {option.label}
              {option.id !== "all" && (
                <span className="filter-count">
                  {orders.filter((o) => o.status === option.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">📅 {order.date}</span>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(order.status),
                        color: "white",
                      }}
                    >
                      {getStatusIcon(order.status)}{" "}
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="order-payment">{order.payment}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-details">
                          {item.quantity} × ₹{item.price}
                        </span>
                        <span className="item-total">
                          ₹{item.quantity * item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-summary">
                      <span className="delivery-info">
                        {order.status !== "cancelled" && (
                          <>🚚 Est. Delivery: {order.estimatedDelivery}</>
                        )}
                        {order.status === "cancelled" && (
                          <>❌ Order Cancelled</>
                        )}
                      </span>
                      <span className="order-total">
                        Total: <strong>₹{order.total}</strong>
                      </span>
                    </div>

                    <div className="order-actions">
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <button className="btn btn-danger btn-sm cancel-btn">
                            Cancel Order
                          </button>
                        )}
                      {order.status === "delivered" && (
                        <button className="btn btn-secondary btn-sm reorder-btn">
                          🔄 Reorder
                        </button>
                      )}
                      <NavLink
                        to={`/order-tracking/${order.id}`}
                        className="btn btn-primary btn-sm track-btn"
                      >
                        Track Order →
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-orders">
              <div className="empty-orders-icon">📦</div>
              <h3>No orders found</h3>
              <p>
                {filterStatus === "all"
                  ? "You haven't placed any orders yet."
                  : `No ${filterStatus} orders found.`}
              </p>
              <NavLink to="/menu" className="btn btn-primary">
                Browse Menu
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
