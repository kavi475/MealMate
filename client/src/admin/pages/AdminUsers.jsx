import React, { useState } from "react";
import "../css/AdminUsers.css";

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@university.edu",
      phone: "+91 98765 43210",
      role: "user",
      orders: 24,
      joined: "Jan 2024",
      status: "active",
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@university.edu",
      phone: "+91 98765 43211",
      role: "user",
      orders: 18,
      joined: "Jan 2024",
      status: "active",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@university.edu",
      phone: "+91 98765 43212",
      role: "admin",
      orders: 5,
      joined: "Dec 2023",
      status: "active",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      email: "sneha@university.edu",
      phone: "+91 98765 43213",
      role: "user",
      orders: 32,
      joined: "Nov 2023",
      status: "active",
    },
    {
      id: 5,
      name: "Vikram Singh",
      email: "vikram@university.edu",
      phone: "+91 98765 43214",
      role: "user",
      orders: 12,
      joined: "Jan 2024",
      status: "inactive",
    },
    {
      id: 6,
      name: "Anjali Verma",
      email: "anjali@university.edu",
      phone: "+91 98765 43215",
      role: "user",
      orders: 8,
      joined: "Jan 2024",
      status: "active",
    },
  ]);

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u,
      ),
    );
  };

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
        </div>

        <div className="user-stats">
          <div className="user-stat">
            <span className="us-value">{users.length}</span>
            <span className="us-label">Total Users</span>
          </div>
          <div className="user-stat">
            <span className="us-value">
              {users.filter((u) => u.status === "active").length}
            </span>
            <span className="us-label">Active</span>
          </div>
          <div className="user-stat">
            <span className="us-value">
              {users.filter((u) => u.role === "admin").length}
            </span>
            <span className="us-label">Admins</span>
          </div>
          <div className="user-stat">
            <span className="us-value">
              {users.reduce((s, u) => s + u.orders, 0)}
            </span>
            <span className="us-label">Total Orders</span>
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

        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Orders</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{user.name.charAt(0)}</div>
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
                      <span className="orders-count">{user.orders}</span>
                    </td>
                    <td>
                      <span className="joined-date">{user.joined}</span>
                    </td>
                    <td>
                      <button
                        className={`status-badge ${user.status}`}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === "active" ? "● Active" : "● Inactive"}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" title="View">
                          👁️
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(user.id)}
                          title="Delete"
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
              <p>Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
