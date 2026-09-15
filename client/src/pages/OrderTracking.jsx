import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import "../css/OrderTracking.css";

export const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  //  Static Order Data
  const ordersData = {
    "ORD-2024-001": {
      id: "ORD-2024-001",
      date: "Jan 17, 2024, 2:30 PM",
      total: 497,
      items: [
        {
          name: "Crispy Veg Cheese Burger",
          quantity: 2,
          price: 199,
          image: "🍔",
        },
        { name: "French Fries", quantity: 1, price: 99, image: "🍟" },
      ],
      status: "delivered",
      deliveryAddress: "123 Campus Road, University City, Delhi - 110001",
      estimatedDelivery: "Jan 17, 2024, 2:50 PM",
      paymentMethod: "Card",
      statusHistory: [
        {
          status: "pending",
          timestamp: "Jan 17, 2:30 PM",
          description: "Order placed",
        },
        {
          status: "confirmed",
          timestamp: "Jan 17, 2:32 PM",
          description: "Order confirmed",
        },
        {
          status: "preparing",
          timestamp: "Jan 17, 2:35 PM",
          description: "Food is being prepared",
        },
        {
          status: "ready",
          timestamp: "Jan 17, 2:45 PM",
          description: "Order is ready for pickup",
        },
        {
          status: "delivered",
          timestamp: "Jan 17, 2:50 PM",
          description: "Order delivered successfully",
        },
      ],
    },
    "ORD-2024-002": {
      id: "ORD-2024-002",
      date: "Jan 16, 2024, 1:15 PM",
      total: 427,
      items: [
        { name: "Paneer Tikka Pizza", quantity: 1, price: 249, image: "🍕" },
        { name: "Cold Coffee", quantity: 2, price: 89, image: "☕" },
      ],
      status: "preparing",
      deliveryAddress:
        "Block A, College Campus, University City, Delhi - 110002",
      estimatedDelivery: "Jan 16, 2024, 1:35 PM",
      paymentMethod: "UPI",
      statusHistory: [
        {
          status: "pending",
          timestamp: "Jan 16, 1:15 PM",
          description: "Order placed",
        },
        {
          status: "confirmed",
          timestamp: "Jan 16, 1:18 PM",
          description: "Order confirmed",
        },
        {
          status: "preparing",
          timestamp: "Jan 16, 1:22 PM",
          description: "Food is being prepared",
        },
      ],
    },
    "ORD-2024-004": {
      id: "ORD-2024-004",
      date: "Jan 15, 2024, 12:45 PM",
      total: 416,
      items: [
        { name: "Special Masala Dosa", quantity: 2, price: 129, image: "🥞" },
        { name: "Gulab Jamun", quantity: 2, price: 79, image: "🍡" },
      ],
      status: "confirmed",
      deliveryAddress: "123 Campus Road, University City, Delhi - 110001",
      estimatedDelivery: "Jan 15, 2024, 1:05 PM",
      paymentMethod: "Card",
      statusHistory: [
        {
          status: "pending",
          timestamp: "Jan 15, 12:45 PM",
          description: "Order placed",
        },
        {
          status: "confirmed",
          timestamp: "Jan 15, 12:48 PM",
          description: "Order confirmed",
        },
      ],
    },
  };

  // Status Steps for Progress Bar
  const statusSteps = [
    { key: "pending", label: "Pending", icon: "⏳" },
    { key: "confirmed", label: "Confirmed", icon: "✅" },
    { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
    { key: "ready", label: "Ready", icon: "📦" },
    { key: "delivered", label: "Delivered", icon: "🚚" },
  ];

  //  Status Color Mapping
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

  // Status Icon Mapping
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

  // Status Label
  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Load Order Data
  useEffect(() => {
    const foundOrder = ordersData[id];
    if (foundOrder) {
      setOrder(foundOrder);
      const index = statusSteps.findIndex((s) => s.key === foundOrder.status);
      setCurrentStatusIndex(index >= 0 ? index : 0);
    } else {
      navigate("/orders");
    }
    setLoading(false);
  }, [id, navigate]);

  // Cancel Order
  const handleCancelOrder = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      alert("Order cancelled successfully!");
      navigate("/orders");
    }
  };

  // Reorder
  const handleReorder = () => {
    alert("Items added to cart!");
    navigate("/cart");
  };

  // Loading State
  if (loading) {
    return (
      <div className="tracking-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Order Not Found
  if (!order) {
    return (
      <div className="tracking-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">😢</div>
            <h3>Order not found</h3>
            <p>The order you're looking for doesn't exist.</p>
            <NavLink to="/orders" className="btn btn-primary">
              Back to Orders
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Progress Percentage
  const progressPercentage =
    ((currentStatusIndex + 1) / statusSteps.length) * 100;

  return (
    <div className="tracking-page">
      <div className="container">
        {/* Page Header */}
        <div className="tracking-header">
          <h1 className="page-title">🚚 Track Your Order</h1>
          <p className="page-subtitle">Real-time status of your order</p>
        </div>

        <div className="tracking-content">
          {/* Order ID & Status */}
          <div className="tracking-summary">
            <div className="order-id-section">
              <span className="order-id-label">Order ID</span>
              <span className="order-id-value">{order.id}</span>
            </div>
            <div className="order-status-section">
              <span
                className="order-status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {getStatusIcon(order.status)} {getStatusLabel(order.status)}
              </span>
              <span className="order-date">{order.date}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="progress-steps">
              {statusSteps.map((step, index) => (
                <div
                  key={step.key}
                  className={`progress-step ${index <= currentStatusIndex ? "active" : ""}`}
                  style={{
                    "--step-color":
                      index <= currentStatusIndex
                        ? getStatusColor(step.key)
                        : "#d1d5db",
                  }}
                >
                  <div className="step-circle">
                    {index < currentStatusIndex ? "✓" : step.icon}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="tracking-grid">
            {/* Left Column - Order Items */}
            <div className="tracking-left">
              <div className="order-items-card">
                <h2 className="card-title">📦 Order Items</h2>
                <div className="order-items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="order-item-info">
                        <span className="item-emoji">{item.image}</span>
                        <div>
                          <span className="item-name">{item.name}</span>
                          <span className="item-qty">× {item.quantity}</span>
                        </div>
                      </div>
                      <span className="item-price">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="order-total-section">
                  <span className="total-label">Total</span>
                  <span className="total-value">₹{order.total}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="delivery-card">
                <h2 className="card-title">📍 Delivery Address</h2>
                <p className="delivery-address">{order.deliveryAddress}</p>
                <div className="delivery-meta">
                  <span>
                    ⏱️ Estimated: <strong>{order.estimatedDelivery}</strong>
                  </span>
                  <span>💳 Paid via {order.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Status Timeline */}
            <div className="tracking-right">
              <div className="timeline-card">
                <h2 className="card-title">📋 Order Timeline</h2>
                <div className="timeline">
                  {order.statusHistory.map((event, index) => (
                    <div key={index} className="timeline-item">
                      <div
                        className="timeline-dot"
                        style={{
                          backgroundColor: getStatusColor(event.status),
                        }}
                      ></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-status">
                            {getStatusIcon(event.status)}{" "}
                            {getStatusLabel(event.status)}
                          </span>
                          <span className="timeline-time">
                            {event.timestamp}
                          </span>
                        </div>
                        <p className="timeline-description">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-card">
                <h2 className="card-title">⚡ Quick Actions</h2>
                <div className="action-buttons">
                  {order.status !== "delivered" &&
                    order.status !== "cancelled" && (
                      <button
                        className="btn btn-danger btn-block cancel-btn"
                        onClick={handleCancelOrder}
                      >
                        ❌ Cancel Order
                      </button>
                    )}
                  {order.status === "delivered" && (
                    <button
                      className="btn btn-primary btn-block reorder-btn"
                      onClick={handleReorder}
                    >
                      🔄 Reorder
                    </button>
                  )}
                  <NavLink to="/orders" className="btn btn-secondary btn-block">
                    📋 View All Orders
                  </NavLink>
                  <NavLink to="/menu" className="btn btn-outline btn-block">
                    🍽️ Continue Shopping
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
