import React, { useState } from "react";
import "../css/AdminOrders.css";

export const AdminOrders = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [orders, setOrders] = useState([
    {
      id: "ORD-2024-009",
      customer: "Rahul Sharma",
      phone: "+91 98765 43210",
      items: 3,
      total: 497,
      status: "delivered",
      payment: "Paid",
      date: "2024-01-17 14:30",
      address: "123 Campus Road, Delhi",
    },
    {
      id: "ORD-2024-008",
      customer: "Priya Patel",
      phone: "+91 98765 43211",
      items: 2,
      total: 249,
      status: "preparing",
      payment: "Paid",
      date: "2024-01-17 14:15",
      address: "Block A, College Campus",
    },
    {
      id: "ORD-2024-007",
      customer: "Amit Kumar",
      phone: "+91 98765 43212",
      items: 4,
      total: 326,
      status: "confirmed",
      payment: "Paid",
      date: "2024-01-17 13:50",
      address: "45 University Lane",
    },
    {
      id: "ORD-2024-006",
      customer: "Sneha Reddy",
      phone: "+91 98765 43213",
      items: 1,
      total: 179,
      status: "pending",
      payment: "Pending",
      date: "2024-01-17 13:30",
      address: "789 Campus Colony",
    },
    {
      id: "ORD-2024-005",
      customer: "Vikram Singh",
      phone: "+91 98765 43214",
      items: 5,
      total: 682,
      status: "delivered",
      payment: "Paid",
      date: "2024-01-17 12:45",
      address: "101 Hostel Block",
    },
    {
      id: "ORD-2024-004",
      customer: "Anjali Verma",
      phone: "+91 98765 43215",
      items: 2,
      total: 416,
      status: "cancelled",
      payment: "Refunded",
      date: "2024-01-17 12:00",
      address: "202 Faculty Quarters",
    },
  ]);

  const statusOptions = [
    { id: "all", label: "All", icon: "📋" },
    { id: "pending", label: "Pending", icon: "⏳" },
    { id: "confirmed", label: "Confirmed", icon: "✅" },
    { id: "preparing", label: "Preparing", icon: "👨‍🍳" },
    { id: "ready", label: "Ready", icon: "📦" },
    { id: "delivered", label: "Delivered", icon: "🚚" },
    { id: "cancelled", label: "Cancelled", icon: "❌" },
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

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
        </div>

        <div className="order-stats">
          <div className="order-stat">
            <span className="os-value">{orders.length}</span>
            <span className="os-label">Total Orders</span>
          </div>
          <div className="order-stat">
            <span className="os-value">
              {orders.filter((o) => o.status === "pending").length}
            </span>
            <span className="os-label">Pending</span>
          </div>
          <div className="order-stat">
            <span className="os-value">
              {orders.filter((o) => o.status === "delivered").length}
            </span>
            <span className="os-label">Delivered</span>
          </div>
          <div className="order-stat">
            <span className="os-value">
              ₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString()}
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
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              className={`filter-btn ${filterStatus === opt.id ? "active" : ""}`}
              onClick={() => setFilterStatus(opt.id)}
            >
              <span>{opt.icon}</span> {opt.label}
              {opt.id !== "all" && (
                <span className="filter-count">
                  {orders.filter((o) => o.status === opt.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id-cell">{order.id}</span>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{order.customer}</span>
                        <span className="customer-phone">{order.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="items-count">{order.items} items</span>
                    </td>
                    <td className="price-cell">₹{order.total}</td>
                    <td>
                      <span className="date-cell">{order.date}</span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        style={{ color: getStatusColor(order.status) }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button className="action-btn view" title="View Details">
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No orders found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
