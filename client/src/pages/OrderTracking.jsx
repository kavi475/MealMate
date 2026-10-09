import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { confirmToast } from "../utils/confirmToast";
import "../css/OrderTracking.css";

export const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  const statusSteps = [
    { key: "pending", label: "Pending", icon: "⏳" },
    { key: "confirmed", label: "Confirmed", icon: "✅" },
    { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
    { key: "ready", label: "Ready", icon: "📦" },
    { key: "delivered", label: "Delivered", icon: "🚚" },
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

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      const orderData = response.data;
      setOrder(orderData);

      const index = statusSteps.findIndex((s) => s.key === orderData.status);
      setCurrentStatusIndex(index >= 0 ? index : 0);
      setError("");
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success("Order cancelled successfully!");
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel order");
    }
  };

  const handleCancelOrder = () => {
    confirmToast("Cancel this order?", cancelOrder, {
      confirmText: "Yes, cancel",
      cancelText: "Keep order",
    });
  };

  const handleReorder = () => {
    toast("Reorder feature coming soon!", { icon: "🔄" });
  };

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

  if (error || !order) {
    return (
      <div className="tracking-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">😢</div>
            <h3>Order not found</h3>
            <p>{error || "The order you're looking for doesn't exist."}</p>
            <NavLink to="/orders" className="btn btn-primary">
              Back to Orders
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage =
    ((currentStatusIndex + 1) / statusSteps.length) * 100;

  return (
    <div className="tracking-page">
      <div className="container">
        <div className="tracking-header">
          <h1 className="page-title">🚚 Track Your Order</h1>
          <p className="page-subtitle">Real-time status of your order</p>
        </div>

        <div className="tracking-content">
          <div className="tracking-summary">
            <div className="order-id-section">
              <span className="order-id-label">Order ID</span>
              <span className="order-id-value">{order.orderId}</span>
            </div>
            <div className="order-status-section">
              <span
                className="order-status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {getStatusIcon(order.status)} {getStatusLabel(order.status)}
              </span>
              <span className="order-date">
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {order.status !== "cancelled" && (
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
                    className={`progress-step ${
                      index <= currentStatusIndex ? "active" : ""
                    }`}
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
          )}

          <div className="tracking-grid">
            <div className="tracking-left">
              <div className="order-items-card">
                <h2 className="card-title">📦 Order Items</h2>
                <div className="order-items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="order-item-info">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="order-item-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
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

              <div className="delivery-card">
                <h2 className="card-title">📍 Delivery Address</h2>
                <p className="delivery-address">
                  {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.pincode}
                </p>
                <div className="delivery-meta">
                  <span>
                    ⏱️ Estimated: <strong>{order.estimatedDelivery}</strong>
                  </span>
                  <span>💳 Paid via {order.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="tracking-right">
              <div className="action-card">
                <h2 className="card-title">⚡ Quick Actions</h2>
                <div className="action-buttons">
                  {(order.status === "pending" ||
                    order.status === "confirmed") && (
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
