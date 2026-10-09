import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "../css/Profile.css";

export const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [editError, setEditError] = useState("");

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
    setEditError("");
    setFieldErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...user });
    setEditError("");
    setFieldErrors({});
  };

  // ━━━ Validation helpers ━━━
  const isValidName = (name) => /^[A-Za-z\s]{2,50}$/.test(name);
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);
  const isValidPincode = (pincode) => /^[0-9]{6}$/.test(pincode);
  const isValidCity = (city) => /^[A-Za-z\s]{2,50}$/.test(city);
  const isValidState = (state) => /^[A-Za-z\s]{2,50}$/.test(state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear error for this specific field
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });

    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setEditData({ ...editData, phone: digits });
      return;
    }

    if (name === "name") {
      if (value && !/^[A-Za-z\s]*$/.test(value)) return;
      setEditData({ ...editData, name: value });
      return;
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      if (child === "pincode") {
        if (value && !/^[0-9]*$/.test(value)) return;
        if (value.length > 6) return;
      }

      if ((child === "city" || child === "state") && value) {
        if (!/^[A-Za-z\s]*$/.test(value)) return;
      }

      setEditData({
        ...editData,
        [parent]: {
          ...(editData[parent] || {}),
          [child]: value,
        },
      });
      return;
    }

    setEditData({ ...editData, [name]: value });
  };

  // ━━━ Validate all fields ━━━
  const validateForm = () => {
    const errors = {};

    if (!editData.name?.trim()) errors.name = "Please enter your name";
    else if (!isValidName(editData.name))
      errors.name = "Name must contain only letters (2-50 characters)";

    if (!editData.phone?.trim())
      errors.phone = "Please enter your phone number";
    else if (!isValidPhone(editData.phone))
      errors.phone = "Phone must be exactly 10 digits";

    // Address validation (if any address field is filled, require all)
    const hasAnyAddress =
      editData.address?.street ||
      editData.address?.city ||
      editData.address?.state ||
      editData.address?.pincode;

    if (hasAnyAddress) {
      if (!editData.address.street?.trim())
        errors["address.street"] = "Please enter street address";

      if (!editData.address.city?.trim())
        errors["address.city"] = "Please enter your city";
      else if (!isValidCity(editData.address.city))
        errors["address.city"] = "City must contain only letters";

      if (!editData.address.state?.trim())
        errors["address.state"] = "Please enter your state";
      else if (!isValidState(editData.address.state))
        errors["address.state"] = "State must contain only letters";

      if (!editData.address.pincode?.trim())
        errors["address.pincode"] = "Please enter your pincode";
      else if (!isValidPincode(editData.address.pincode))
        errors["address.pincode"] = "Pincode must be exactly 6 digits";
    }

    return errors;
  };

  // ━━━ Auto-scroll to first error ━━━
  const scrollToError = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) return;

    setTimeout(() => {
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
        el.classList.add("shake");
        setTimeout(() => el.classList.remove("shake"), 500);
      }
    }, 100);
  };

  const handleSave = async () => {
    setEditError("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      scrollToError(errors);
      return;
    }

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
      setEditError(err.response?.data?.error || "Failed to update profile");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getError = (field) => fieldErrors[field];

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
          <div className="profile-left">
            <div className="profile-card">
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
                            ? `${user.address.street}, ${user.address.city || ""}, ${user.address.state || ""} - ${user.address.pincode || ""}`
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
                  <div className="profile-edit">
                    <h3 className="edit-title">Edit Profile</h3>

                    {editError && (
                      <div className="error-message">{editError}</div>
                    )}

                    <div className="edit-form">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          className={`form-input ${getError("name") ? "input-error" : ""}`}
                          value={editData.name || ""}
                          onChange={handleChange}
                          placeholder="Letters only"
                        />
                        {getError("name") && (
                          <div className="field-error">
                            ⚠️ {getError("name")}
                          </div>
                        )}
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
                          className={`form-input ${getError("phone") ? "input-error" : ""}`}
                          value={editData.phone || ""}
                          onChange={handleChange}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          inputMode="numeric"
                        />
                        {getError("phone") && (
                          <div className="field-error">
                            ⚠️ {getError("phone")}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Street Address</label>
                        <input
                          type="text"
                          name="address.street"
                          className={`form-input ${getError("address.street") ? "input-error" : ""}`}
                          value={editData.address?.street || ""}
                          onChange={handleChange}
                          placeholder="House no, Street, Area"
                        />
                        {getError("address.street") && (
                          <div className="field-error">
                            ⚠️ {getError("address.street")}
                          </div>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            name="address.city"
                            className={`form-input ${getError("address.city") ? "input-error" : ""}`}
                            value={editData.address?.city || ""}
                            onChange={handleChange}
                            placeholder="Letters only"
                          />
                          {getError("address.city") && (
                            <div className="field-error">
                              ⚠️ {getError("address.city")}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-label">State</label>
                          <input
                            type="text"
                            name="address.state"
                            className={`form-input ${getError("address.state") ? "input-error" : ""}`}
                            value={editData.address?.state || ""}
                            onChange={handleChange}
                            placeholder="Letters only"
                          />
                          {getError("address.state") && (
                            <div className="field-error">
                              ⚠️ {getError("address.state")}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Pincode</label>
                        <input
                          type="text"
                          name="address.pincode"
                          className={`form-input ${getError("address.pincode") ? "input-error" : ""}`}
                          value={editData.address?.pincode || ""}
                          onChange={handleChange}
                          placeholder="6 digits"
                          maxLength={6}
                          inputMode="numeric"
                        />
                        {getError("address.pincode") && (
                          <div className="field-error">
                            ⚠️ {getError("address.pincode")}
                          </div>
                        )}
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
