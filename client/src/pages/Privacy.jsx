import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Privacy.css";

export const Privacy = () => {
  return (
    <div className="privacy-page">
      <div className="container">
        {/* Header */}
        <div className="privacy-header">
          <h1 className="page-title">🔒 Privacy Policy</h1>
          <p className="page-subtitle">Last updated: January 2024</p>
        </div>

        <div className="privacy-content">
          <div className="privacy-card">
            <p className="privacy-intro">
              At MealMate, we take your privacy seriously. This policy describes
              how we collect, use, and protect your personal information when
              you use our service.
            </p>

            <div className="privacy-section">
              <h2 className="section-title">📋 Information We Collect</h2>
              <ul>
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number, delivery address
                </li>
                <li>
                  <strong>Order History:</strong> Your past orders, preferences,
                  and special instructions
                </li>
                <li>
                  <strong>Payment Information:</strong> Payment method details
                  (processed securely)
                </li>
                <li>
                  <strong>Device Information:</strong> Browser type, IP address,
                  device type
                </li>
                <li>
                  <strong>Usage Data:</strong> How you interact with our website
                </li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2 className="section-title">🔧 How We Use Your Information</h2>
              <ul>
                <li>Process and deliver your orders</li>
                <li>Send order confirmations and updates</li>
                <li>Improve our services and user experience</li>
                <li>Send promotional offers (with your consent)</li>
                <li>Handle customer support requests</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h2 className="section-title">🛡️ Data Security</h2>
              <p>
                We implement appropriate security measures to protect your
                personal information. Your data is encrypted and stored
                securely. We never share your information with third parties
                without your explicit consent.
              </p>
            </div>

            <div className="privacy-section">
              <h2 className="section-title">🍪 Cookies</h2>
              <p>
                We use cookies to enhance your experience on our website.
                Cookies help us remember your preferences and track usage
                patterns. You can control cookie settings in your browser.
              </p>
            </div>

            <div className="privacy-section">
              <h2 className="section-title">📧 Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="contact-email">
                <strong>✉️ support@mealmate.com</strong>
              </p>
            </div>

            <div className="privacy-footer">
              <NavLink to="/" className="btn btn-secondary">
                ← Back to Home
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
