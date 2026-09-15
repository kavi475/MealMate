import React from "react";
import { NavLink } from "react-router-dom";
import "../css/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">MealMate</span>
          </div>

          <p className="footer-copyright">© 2026 MealMate Canteen System</p>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <NavLink to="/contact" className="footer-link">
            Contact Us
          </NavLink>

          <NavLink to="/privacy" className="footer-link">
            Privacy Policy
          </NavLink>

          <NavLink to="/terms" className="footer-link">
            Terms of Service
          </NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
