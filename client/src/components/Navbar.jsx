import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/navbar.css";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Cart count
  const [cartCount] = useState(3);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <span className="logo-icon">🍴</span>
        <span>MealMate</span>
      </div>

      {/* Desktop Navigation */}
      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        <NavLink to="/" end onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/menu" onClick={closeMenu}>
          Menu
        </NavLink>

        <NavLink to="/orders" onClick={closeMenu}>
          Orders
        </NavLink>

        {/* Mobile extra links */}
        <NavLink to="/cart" className="mobile-cart-link" onClick={closeMenu}>
          🛒 Cart{" "}
          {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
        </NavLink>

        <NavLink
          to="/profile"
          className="mobile-profile-link"
          onClick={closeMenu}
        >
          👤 Profile
        </NavLink>
      </div>

      <div className="navbar-actions">
        <NavLink to="/cart" className="cart">
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>
        <NavLink to="/profile" className="profile">
          👤
        </NavLink>
        <NavLink to="/login" className="auth-nav-link">
          {" "}
          Login{" "}
        </NavLink>{" "}
        <NavLink to="/register" className="auth-nav-link">
          {" "}
          Register{" "}
        </NavLink>
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
