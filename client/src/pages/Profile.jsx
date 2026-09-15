import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Profile.css";

export const Profile = () => {
  const navigate = useNavigate();

  //  Static User Data
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@university.edu",
    phone: "+91 98765 43210",
    joinDate: "January 2024",
    avatar: "👨‍🎓",
    address: {
      street: "123 Campus Road",
      city: "University City",
      pincode: "110001",
    },
    stats: {
      orders: 24,
      totalSpent: 8497,
      favorites: 6,
    },
  });

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });

  // Order history (static)
  const recentOrders = [
    {
      id: "ORD-2024-004",
      date: "Jan 17, 2024",
      total: 416,
      status: "confirmed",
    },
    {
      id: "ORD-2024-002",
      date: "Jan 16, 2024",
      total: 427,
      status: "preparing",
    },
    {
      id: "ORD-2024-001",
      date: "Jan 15, 2024",
      total: 497,
      status: "delivered",
    },
    {
      id: "ORD-2024-003",
      date: "Jan 14, 2024",
      total: 326,
      status: "cancelled",
    },
  ];

  // ✅ Handle Edit
  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...user });
  };

  const handleSave = () => {
    setUser({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...user });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditData({
        ...editData,
        [parent]: {
          ...editData[parent],
          [child]: value,
        },
      });
    } else {
      setEditData({
        ...editData,
        [name]: value,
      });
    }
  };

  //  Logout Function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear any auth data here
      navigate("/");
    }
  };

  // Status color
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
    <div className="profile-page">
      <div className="container">
        {/* Page Header */}
        <div className="profile-header">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">
            Manage your account details and preferences
          </p>
        </div>

        <div className="profile-content">
          {/* Left Column - Profile Info */}
          <div className="profile-left">
            <div className="profile-card">
              {/* Avatar Section */}
              <div className="profile-avatar-section">
                <div className="profile-avatar">{user.avatar}</div>
                <div className="profile-name-section">
                  <h2 className="profile-name">{user.name}</h2>
                  <p className="profile-email">{user.email}</p>
                  <p className="profile-join">Member since {user.joinDate}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{user.stats.orders}</span>
                  <span className="stat-label">Orders</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">₹{user.stats.totalSpent}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">{user.stats.favorites}</span>
                  <span className="stat-label">Favorites</span>
                </div>
              </div>

              {!isEditing ? (
                <>
                  {/* Display Mode */}
                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="detail-icon">📱</span>
                      <div>
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">{user.phone}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <div>
                        <span className="detail-label">Address</span>
                        <span className="detail-value">
                          {user.address.street}, {user.address.city},{" "}
                          {user.address.pincode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="profile-actions">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={handleEdit}
                    >
                      ✏️ Edit Profile
                    </button>
                    <NavLink
                      to="/change-password"
                      className="btn btn-secondary btn-block"
                    >
                      🔒 Change Password
                    </NavLink>
                    <button
                      className="btn btn-danger btn-block logout-btn"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Edit Mode */}
                  <div className="profile-edit">
                    <h3 className="edit-title">Edit Profile</h3>

                    <div className="edit-form">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-input"
                          value={editData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-input"
                          value={editData.email}
                          onChange={handleChange}
                          disabled
                        />
                        <span className="form-hint">
                          Email cannot be changed
                        </span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-input"
                          value={editData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Street Address</label>
                        <input
                          type="text"
                          name="address.street"
                          className="form-input"
                          value={editData.address.street}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            name="address.city"
                            className="form-input"
                            value={editData.address.city}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Pincode</label>
                          <input
                            type="text"
                            name="address.pincode"
                            className="form-input"
                            value={editData.address.pincode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="edit-actions">
                        <button
                          className="btn btn-primary"
                          onClick={handleSave}
                        >
                          💾 Save Changes
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Recent Orders */}
          <div className="profile-right">
            <div className="recent-orders-card">
              <div className="recent-orders-header">
                <h3 className="recent-orders-title">📦 Recent Orders</h3>
                <NavLink to="/orders" className="view-all-link">
                  View All →
                </NavLink>
              </div>

              <div className="recent-orders-list">
                {recentOrders.map((order) => (
                  <div key={order.id} className="recent-order-item">
                    <div className="recent-order-info">
                      <span className="recent-order-id">{order.id}</span>
                      <span className="recent-order-date">{order.date}</span>
                    </div>
                    <div className="recent-order-details">
                      <span className="recent-order-total">₹{order.total}</span>
                      <span
                        className="recent-order-status"
                        style={{ color: getStatusColor(order.status) }}
                      >
                        ●{" "}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="recent-orders-footer">
                <NavLink to="/orders" className="btn btn-secondary btn-block">
                  View All Orders
                </NavLink>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h3 className="quick-actions-title">⚡ Quick Actions</h3>
              <div className="quick-actions-grid">
                <NavLink to="/menu" className="quick-action-item">
                  <span className="quick-action-icon">🍽️</span>
                  <span>Order Now</span>
                </NavLink>
                <NavLink to="/cart" className="quick-action-item">
                  <span className="quick-action-icon">🛒</span>
                  <span>View Cart</span>
                </NavLink>
                <NavLink to="/orders" className="quick-action-item">
                  <span className="quick-action-icon">📦</span>
                  <span>My Orders</span>
                </NavLink>
                <NavLink to="/favorites" className="quick-action-item">
                  <span className="quick-action-icon">❤️</span>
                  <span>Favorites</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
