import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../css/navbar.css";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeAll = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAll();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <span className="logo-icon">🍴</span>
        <span>MealMate</span>
      </div>

      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        <NavLink to="/" end onClick={closeAll}>
          Home
        </NavLink>
        <NavLink to="/menu" onClick={closeAll}>
          Menu
        </NavLink>
        <NavLink to="/orders" onClick={closeAll}>
          Orders
        </NavLink>

        <NavLink to="/cart" className="mobile-cart-link" onClick={closeAll}>
          🛒 Cart{" "}
          {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
        </NavLink>

        <NavLink
          to="/profile"
          className="mobile-profile-link"
          onClick={closeAll}
        >
          👤 Profile
        </NavLink>
      </div>

      <div className="navbar-actions">
        <NavLink to="/cart" className="cart">
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>

        {isAuthenticated ? (
          <div className="user-menu" ref={dropdownRef}>
            <button className="user-avatar-btn" onClick={toggleDropdown}>
              <span className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="dropdown-user-info">
                    <span className="dropdown-name">{user.name}</span>
                    <span className="dropdown-email">{user.email}</span>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <NavLink
                  to="/profile"
                  className="dropdown-item"
                  onClick={closeAll}
                >
                  <span className="dropdown-icon">👤</span>
                  <span>My Profile</span>
                </NavLink>
                <NavLink
                  to="/orders"
                  className="dropdown-item"
                  onClick={closeAll}
                >
                  <span className="dropdown-icon">📦</span>
                  <span>My Orders</span>
                </NavLink>
                <NavLink
                  to="/favorites"
                  className="dropdown-item"
                  onClick={closeAll}
                >
                  <span className="dropdown-icon">❤️</span>
                  <span>Favorites</span>
                </NavLink>

                {user?.role === "admin" && (
                  <>
                    <div className="dropdown-divider"></div>
                    <NavLink
                      to="/admin/dashboard"
                      className="dropdown-item admin-link"
                      onClick={closeAll}
                    >
                      <span className="dropdown-icon">👑</span>
                      <span>Admin Dashboard</span>
                    </NavLink>
                  </>
                )}

                <div className="dropdown-divider"></div>

                <button
                  onClick={handleLogout}
                  className="dropdown-item logout-item"
                >
                  <span className="dropdown-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink to="/login" className="auth-nav-link">
              Login
            </NavLink>
            <NavLink to="/register" className="auth-nav-link register">
              Register
            </NavLink>
          </>
        )}

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
};
