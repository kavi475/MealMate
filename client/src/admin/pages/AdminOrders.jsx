import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import "../css/AdminOrders.css";

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders/admin/all");
      setOrders(response.data.orders || []);
      setStats(response.data.stats || {});
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⭐ STATUS FLOW — Only forward
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const STATUS_ORDER = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
  ];

  const getAvailableStatuses = (currentStatus) => {
    // Cancelled is terminal — no changes allowed
    if (currentStatus === "cancelled") {
      return ["cancelled"];
    }

    // Delivered is terminal — no changes allowed
    if (currentStatus === "delivered") {
      return ["delivered"];
    }

    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    if (currentIndex === -1) return STATUS_ORDER;

    // Only allow current status and forward statuses
    return STATUS_ORDER.slice(currentIndex);
  };

  const handleStatusChange = async (orderId, currentStatus, newStatus) => {
    // ⭐ Extra safety check
    if (!isValidTransition(currentStatus, newStatus)) {
      alert(`Cannot change status from "${currentStatus}" to "${newStatus}"`);
      return;
    }

    if (
      !window.confirm(
        `Change order status from "${currentStatus}" to "${newStatus}"?`,
      )
    ) {
      return;
    }

    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const isValidTransition = (currentStatus, newStatus) => {
    // Cancelled → nothing
    if (currentStatus === "cancelled") return false;

    // Delivered → nothing
    if (currentStatus === "delivered") return false;

    // Allow setting to cancelled anytime before delivered
    if (newStatus === "cancelled") return true;

    // Otherwise, must move forward in the flow
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    const newIndex = STATUS_ORDER.indexOf(newStatus);

    return newIndex > currentIndex;
  };

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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.userId?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">📦 Order Management</h1>
            <p className="page-subtitle">
              Track and manage all customer orders
            </p>
          </div>
          <button className="btn btn-secondary" onClick={fetchOrders}>
            🔄 Refresh
          </button>
        </div>

        <div className="order-stats">
          <div className="order-stat">
            <span className="os-value">{stats.total || 0}</span>
            <span className="os-label">Total Orders</span>
          </div>
          <div className="order-stat">
            <span className="os-value">{stats.pending || 0}</span>
            <span className="os-label">Pending</span>
          </div>
          <div className="order-stat">
            <span className="os-value">{stats.delivered || 0}</span>
            <span className="os-label">Delivered</span>
          </div>
          <div className="order-stat">
            <span className="os-value">
              ₹{(stats.revenue || 0).toLocaleString()}
            </span>
            <span className="os-label">Total Revenue</span>
          </div>
        </div>

        <div className="order-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="status-filters">
          {[
            "all",
            "pending",
            "confirmed",
            "preparing",
            "ready",
            "delivered",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              className={`filter-btn ${
                filterStatus === status ? "active" : ""
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const availableStatuses = getAvailableStatuses(order.status);
                  const isFinal =
                    order.status === "delivered" ||
                    order.status === "cancelled";

                  return (
                    <tr key={order._id}>
                      <td>
                        <span className="order-id-cell">{order.orderId}</span>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <span className="customer-name">
                            {order.userId?.name || "N/A"}
                          </span>
                          <span className="customer-phone">
                            {order.userId?.phone || ""}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="items-count">
                          {order.items.length} items
                        </span>
                      </td>
                      <td className="price-cell">₹{order.total}</td>
                      <td>
                        <span className="date-cell">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td>
                        {isFinal ? (
                          <span
                            className="status-badge-final"
                            style={{
                              backgroundColor: getStatusColor(order.status),
                            }}
                          >
                            {order.status === "delivered" && "🚚 Delivered"}
                            {order.status === "cancelled" && "❌ Cancelled"}
                          </span>
                        ) : (
                          <select
                            className="status-select"
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order.orderId,
                                order.status,
                                e.target.value,
                              )
                            }
                            disabled={updatingId === order.orderId}
                            style={{ color: getStatusColor(order.status) }}
                          >
                            {availableStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No orders found</h3>
              <p>
                {orders.length === 0
                  ? "No orders have been placed yet."
                  : "Try adjusting your search or filter"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
