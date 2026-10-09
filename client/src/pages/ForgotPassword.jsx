import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../css/ForgetPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!formData.currentPassword) {
      setError("Please enter your current password.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (formData.newPassword === formData.currentPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email: formData.email.trim().toLowerCase(),
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          (err.request
            ? "Cannot reach the server. Is the backend running?"
            : "Failed to update password. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-icon">🔐</div>
        <h2 className="forgot-title">Reset Password</h2>
        <p className="forgot-subtitle">
          Enter your email along with your current and new password to reset it.
        </p>

        {error && <div className="forgot-error-banner">⚠️ {error}</div>}
        {success && <div className="forgot-success-banner">✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="forgot-form-group">
            <label className="forgot-label">Email Address</label>
            <div className="forgot-input-wrapper">
              <span className="forgot-input-icon">📧</span>
              <input
                type="email"
                name="email"
                className="forgot-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="forgot-form-group">
            <label className="forgot-label">Current Password</label>
            <div className="forgot-input-wrapper">
              <span className="forgot-input-icon">🔒</span>
              <input
                type={showCurrentPwd ? "text" : "password"}
                name="currentPassword"
                className="forgot-input"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="forgot-eye-btn"
                onClick={() => setShowCurrentPwd((v) => !v)}
                tabIndex={-1}
              >
                {showCurrentPwd ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="forgot-form-group">
            <label className="forgot-label">New Password</label>
            <div className="forgot-input-wrapper">
              <span className="forgot-input-icon">🔑</span>
              <input
                type={showNewPwd ? "text" : "password"}
                name="newPassword"
                className="forgot-input"
                placeholder="Enter new password (min 6 chars)"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="forgot-eye-btn"
                onClick={() => setShowNewPwd((v) => !v)}
                tabIndex={-1}
              >
                {showNewPwd ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="forgot-form-group">
            <label className="forgot-label">Confirm New Password</label>
            <div className="forgot-input-wrapper">
              <span className="forgot-input-icon">🔑</span>
              <input
                type={showConfirmPwd ? "text" : "password"}
                name="confirmPassword"
                className="forgot-input"
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="forgot-eye-btn"
                onClick={() => setShowConfirmPwd((v) => !v)}
                tabIndex={-1}
              >
                {showConfirmPwd ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button type="submit" className="forgot-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <NavLink to="/login" className="forgot-back-link">
          ← Back to Login
        </NavLink>
      </div>
    </div>
  );
};

export default ForgotPassword;
