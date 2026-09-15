import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Terms.css";

export const Terms = () => {
  return (
    <div className="terms-page">
      <div className="container">
        {/* Header */}
        <div className="terms-header">
          <h1 className="page-title">📜 Terms & Conditions</h1>
          <p className="page-subtitle">Last updated: January 2024</p>
        </div>

        <div className="terms-content">
          <div className="terms-card">
            <p className="terms-intro">
              Welcome to MealMate! By using our service, you agree to these
              terms and conditions. Please read them carefully.
            </p>

            <div className="terms-section">
              <h2 className="section-title">1. 📝 Acceptance of Terms</h2>
              <p>
                By creating an account or using our services, you agree to be
                bound by these Terms & Conditions. If you do not agree, please
                do not use our services.
              </p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">2. 🍽️ Ordering & Payments</h2>
              <ul>
                <li>All orders are subject to availability</li>
                <li>Prices are subject to change without notice</li>
                <li>Payment must be completed before order processing</li>
                <li>We accept multiple payment methods</li>
                <li>You must provide accurate delivery information</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2 className="section-title">3. ⏰ Cancellation & Refunds</h2>
              <ul>
                <li>Orders can be cancelled within 5 minutes of placing</li>
                <li>Refunds are processed within 3-5 business days</li>
                <li>If food quality issues arise, please contact support</li>
                <li>We reserve the right to cancel any order</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2 className="section-title">4. 👤 User Accounts</h2>
              <ul>
                <li>You are responsible for your account security</li>
                <li>Provide accurate and current information</li>
                <li>Notify us of any unauthorized use</li>
                <li>We reserve the right to suspend accounts</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2 className="section-title">5. 🛡️ Privacy & Data</h2>
              <p>
                Your privacy is important to us. We collect and use your data as
                described in our
                <NavLink to="/privacy" className="terms-link">
                  {" "}
                  Privacy Policy
                </NavLink>
                .
              </p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">6. ⚡ Limitation of Liability</h2>
              <p>
                MealMate is not liable for any indirect, incidental, or
                consequential damages arising from the use of our services. We
                strive to provide the best experience but cannot guarantee
                uninterrupted service.
              </p>
            </div>

            <div className="terms-section">
              <h2 className="section-title">7. 📧 Contact</h2>
              <p>For questions about these terms, contact us at:</p>
              <p className="contact-email">
                <strong>✉️ support@mealmate.com</strong>
              </p>
            </div>

            <div className="terms-footer">
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
