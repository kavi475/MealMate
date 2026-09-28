import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "../css/Profile.css";

export const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/profile");
      setUser(response.data);
      setEditData(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...user });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...user });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditData({
        ...editData,
        [parent]: {
          ...(editData[parent] || {}),
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put("/users/profile", {
        name: editData.name,
        phone: editData.phone,
        address: editData.address || {},
      });
      setUser(response.data);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">😢</div>
            <h3>Failed to load profile</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchProfile}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">
            Manage your account details and preferences
          </p>
        </div>

        {successMessage && (
          <div className="success-banner">✅ {successMessage}</div>
        )}

        <div className="profile-content">
          {/* Left Column */}
          <div className="profile-left">
            <div className="profile-card">
              {/* Avatar Section */}
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="profile-name-section">
                  <h2 className="profile-name">{user.name}</h2>
                  <p className="profile-email">{user.email}</p>
                  <p className="profile-join">
                    Member since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
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
                        <span className="detail-value">
                          {user.phone || "Not set"}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <div>
                        <span className="detail-label">Address</span>
                        <span className="detail-value">
                          {user.address?.street
                            ? `${user.address.street}, ${user.address.city || ""}, ${user.address.pincode || ""}`
                            : "Not set"}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">👤</span>
                      <div>
                        <span className="detail-label">Role</span>
                        <span className="detail-value">
                          {user.role === "admin" ? "👑 Admin" : "👤 User"}
                        </span>
                      </div>
                    </div>
                  </div>

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

                    {error && <div className="error-message">{error}</div>}

                    <div className="edit-form">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-input"
                          value={editData.name || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-input"
                          value={editData.email || ""}
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
                          value={editData.phone || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Street Address</label>
                        <input
                          type="text"
                          name="address.street"
                          className="form-input"
                          value={editData.address?.street || ""}
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
                            value={editData.address?.city || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Pincode</label>
                          <input
                            type="text"
                            name="address.pincode"
                            className="form-input"
                            value={editData.address?.pincode || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="edit-actions">
                        <button
                          className="btn btn-primary"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-small"></span>
                              Saving...
                            </>
                          ) : (
                            "💾 Save Changes"
                          )}
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={handleCancel}
                          disabled={saving}
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

          {/* Right Column */}
          <div className="profile-right">
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
