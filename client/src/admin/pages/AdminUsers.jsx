import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import "../css/AdminUsers.css";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.delete(`/users/admin/${id}`);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user");
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

        {/* Stats */}
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

        {/* Controls */}
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

        {/* Table */}
        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <span className="contact-email">{user.email}</span>
                        <span className="contact-phone">{user.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-tag ${user.role}`}>
                        {user.role === "admin" ? "👑 Admin" : "👤 User"}
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
                          className="action-btn delete"
                          onClick={() => handleDelete(user._id, user.name)}
                          title="Delete user"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      </div>
    </div>
  );
};
