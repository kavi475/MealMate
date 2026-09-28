import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../admin/css/AdminLayout.css";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const navItems = [
    { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/admin/menu", icon: "🍽️", label: "Menu" },
    { path: "/admin/orders", icon: "📦", label: "Orders" },
    { path: "/admin/users", icon: "👥", label: "Users" },
    { path: "/admin/reports", icon: "📈", label: "Reports" },
  ];

  return (
    <div className="admin-layout">
      {/* ADMIN SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <span className="admin-logo-icon">🍽️</span>
            {sidebarOpen && <span className="admin-logo-text">MealMate</span>}
          </div>
          {sidebarOpen && <span className="admin-badge">Admin</span>}
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {sidebarOpen && (
                <span className="admin-nav-label">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-nav-item logout">
            <span className="admin-nav-icon">🚪</span>
            {sidebarOpen && <span className="admin-nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="admin-main-wrapper">
        {/* ADMIN TOPBAR */}
        <header className="admin-topbar">
          <button
            className="admin-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <div className="admin-topbar-right">
            <div className="admin-user-info">
              <span className="admin-user-name">{user?.name || "Admin"}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* ADMIN CONTENT */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
