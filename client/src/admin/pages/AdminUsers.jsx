import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { confirmToast } from "../../utils/confirmToast";
import { useAuth } from "../../context/AuthContext";
import "../css/AdminUsers.css";

export const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Edit modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/admin/all");
      setUsers(response.data.users || []);
      setStats(response.data.stats || { total: 0, admins: 0, users: 0 });
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id, name) => {
    try {
      await api.delete(`/users/admin/${id}`);
      setSuccessMessage(`User "${name}" deleted successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete user");
    }
  };

  //Handle delete with protections
  const handleDelete = (id, name) => {
    if (id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    confirmToast(
      `Are you sure you want to delete "${name}"?`,
      () => deleteUser(id, name),
      {
        confirmText: "Yes, delete",
        cancelText: "Cancel",
        variant: "danger",
      },
    );
  };

  // Open edit modal
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditData({
      name: user.name,
      phone: user.phone,
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      },
    });
    setFieldErrors({});
    setShowModal(true);
  };

  // Validation helpers
  const isValidName = (name) => /^[A-Za-z\s]{2,50}$/.test(name);
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);
  const isValidPincode = (pincode) => /^[0-9]{6}$/.test(pincode);
  const isValidCity = (city) => /^[A-Za-z\s]{2,50}$/.test(city);
  const isValidState = (state) => /^[A-Za-z\s]{2,50}$/.test(state);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
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
        [parent]: { ...editData[parent], [child]: value },
      });
      return;
    }

    setEditData({ ...editData, [name]: value });
  };

  const validateEdit = () => {
    const errors = {};

    if (!editData.name?.trim()) errors.name = "Name is required";
    else if (!isValidName(editData.name))
      errors.name = "Only letters (2-50 chars)";

    if (!editData.phone?.trim()) errors.phone = "Phone is required";
    else if (!isValidPhone(editData.phone))
      errors.phone = "Must be exactly 10 digits";

    if (editData.address?.street?.trim()) {
      if (!editData.address.city?.trim())
        errors["address.city"] = "City required";
      else if (!isValidCity(editData.address.city))
        errors["address.city"] = "Only letters";

      if (!editData.address.state?.trim())
        errors["address.state"] = "State required";
      else if (!isValidState(editData.address.state))
        errors["address.state"] = "Only letters";

      if (!editData.address.pincode?.trim())
        errors["address.pincode"] = "Pincode required";
      else if (!isValidPincode(editData.address.pincode))
        errors["address.pincode"] = "6 digits";
    }

    return errors;
  };

  const handleSaveEdit = async () => {
    const errors = validateEdit();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      await api.put(`/users/admin/${editingUser._id}`, {
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
      });
      setSuccessMessage(`User "${editData.name}" updated successfully`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getError = (field) => fieldErrors[field];

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="admin-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">👥 User Management</h1>
            <p className="page-subtitle">
              View and manage all registered users
            </p>
          </div>
          <button className="btn btn-secondary" onClick={fetchUsers}>
            🔄 Refresh
          </button>
        </div>

        {successMessage && (
          <div className="success-banner">✅ {successMessage}</div>
        )}

        <div className="user-stats">
          <div className="user-stat">
            <span className="us-value">{stats.total}</span>
            <span className="us-label">Total Users</span>
          </div>
          <div className="user-stat">
            <span className="us-value">{stats.users}</span>
            <span className="us-label">Customers</span>
          </div>
          <div className="user-stat">
            <span className="us-value">{stats.admins}</span>
            <span className="us-label">Admins</span>
          </div>
        </div>

        <div className="user-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="role-filters">
            <button
              className={`role-btn ${filterRole === "all" ? "active" : ""}`}
              onClick={() => setFilterRole("all")}
            >
              All
            </button>
            <button
              className={`role-btn ${filterRole === "user" ? "active" : ""}`}
              onClick={() => setFilterRole("user")}
            >
              Users
            </button>
            <button
              className={`role-btn ${filterRole === "admin" ? "active" : ""}`}
              onClick={() => setFilterRole("admin")}
            >
              Admins
            </button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isSelf = user._id === currentUser?.id;
                  const isAdmin = user.role === "admin";

                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-details">
                            <span className="user-name">
                              {user.name}
                              {isSelf && (
                                <span className="you-badge"> (You)</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <span className="contact-email">{user.email}</span>
                          <span className="contact-phone">{user.phone}</span>
                        </div>
                      </td>
                      <td>
                        <div className="address-cell">
                          {user.address?.street ? (
                            <>
                              <span className="address-line">
                                {user.address.street}
                              </span>
                              <span className="address-line">
                                {user.address.city}
                                {user.address.state &&
                                  `, ${user.address.state}`}
                                {user.address.pincode &&
                                  ` - ${user.address.pincode}`}
                              </span>
                            </>
                          ) : (
                            <span className="no-address">Not set</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`role-tag ${user.role}`}>
                          {isAdmin ? "👑 Admin" : "👤 User"}
                        </span>
                      </td>
                      <td>
                        <span className="joined-date">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(user)}
                            title="Edit user"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(user._id, user.name)}
                            disabled={isSelf || isAdmin}
                            title={
                              isSelf
                                ? "Cannot delete yourself"
                                : isAdmin
                                  ? "Cannot delete admin"
                                  : "Delete user"
                            }
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No users found</h3>
              <p>
                {users.length === 0
                  ? "No users have registered yet."
                  : "Try adjusting your search or filter"}
              </p>
            </div>
          )}
        </div>

        {/* EDIT USER MODAL */}
        {showModal && editingUser && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit User: {editingUser.name}</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-input ${getError("name") ? "input-error" : ""}`}
                    value={editData.name}
                    onChange={handleEditChange}
                    placeholder="Letters only"
                  />
                  {getError("name") && (
                    <div className="field-error">⚠️ {getError("name")}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Email (read-only)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editingUser.email}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-input ${getError("phone") ? "input-error" : ""}`}
                    value={editData.phone}
                    onChange={handleEditChange}
                    maxLength={10}
                    inputMode="numeric"
                  />
                  {getError("phone") && (
                    <div className="field-error">⚠️ {getError("phone")}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    className="form-input"
                    value={editData.address.street}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="address.city"
                      className={`form-input ${getError("address.city") ? "input-error" : ""}`}
                      value={editData.address.city}
                      onChange={handleEditChange}
                    />
                    {getError("address.city") && (
                      <div className="field-error">
                        ⚠️ {getError("address.city")}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="address.state"
                      className={`form-input ${getError("address.state") ? "input-error" : ""}`}
                      value={editData.address.state}
                      onChange={handleEditChange}
                    />
                    {getError("address.state") && (
                      <div className="field-error">
                        ⚠️ {getError("address.state")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="address.pincode"
                    className={`form-input ${getError("address.pincode") ? "input-error" : ""}`}
                    value={editData.address.pincode}
                    onChange={handleEditChange}
                    maxLength={6}
                    inputMode="numeric"
                  />
                  {getError("address.pincode") && (
                    <div className="field-error">
                      ⚠️ {getError("address.pincode")}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
