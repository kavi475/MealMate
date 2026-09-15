import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/ChangePassword.css";

export const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="change-password-page">
      <div className="container">
        <div className="change-password-card">
          <div className="change-password-header">
            <h1 className="page-title">🔒 Change Password</h1>
            <p className="page-subtitle">
              Update your password to keep your account secure
            </p>
          </div>

          {success ? (
            <div className="success-message">
              <span className="success-icon">✅</span>
              <h3>Password Changed Successfully!</h3>
              <p>Redirecting to profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="change-password-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-input"
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-input"
                  placeholder="Enter new password (min 6 characters)"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
                <NavLink to="/profile" className="btn btn-secondary btn-block">
                  Cancel
                </NavLink>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
