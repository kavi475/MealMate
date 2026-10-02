import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/Auth.css";

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  // ━━━ Validation helpers ━━━
  const isValidName = (name) => /^[A-Za-z\s]{2,50}$/.test(name);
  const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone); // ⭐ Only 10 digits
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPincode = (pincode) => /^[0-9]{6}$/.test(pincode);
  const isValidCity = (city) => /^[A-Za-z\s]{2,50}$/.test(city);
  const isValidState = (state) => /^[A-Za-z\s]{2,50}$/.test(state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear error for this specific field
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
    setGeneralError("");

    // Phone: digits only, max 10
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, phone: digits });
      return;
    }

    // Name: letters + spaces only
    if (name === "name") {
      if (value && !/^[A-Za-z\s]*$/.test(value)) return;
      setFormData({ ...formData, name: value });
      return;
    }

    // Nested address fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      if (child === "pincode") {
        if (value && !/^[0-9]*$/.test(value)) return;
        if (value.length > 6) return;
      }

      if ((child === "city" || child === "state") && value) {
        if (!/^[A-Za-z\s]*$/.test(value)) return;
      }

      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value },
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // ━━━ Validate all fields and return errors object ━━━
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Please enter your name";
    else if (!isValidName(formData.name))
      errors.name = "Name must contain only letters (2-50 characters)";

    if (!formData.email.trim()) errors.email = "Please enter your email";
    else if (!isValidEmail(formData.email))
      errors.email = "Please enter a valid email address";

    if (!formData.phone.trim()) errors.phone = "Please enter your phone number";
    else if (!isValidPhone(formData.phone))
      errors.phone = "Phone must be exactly 10 digits";

    if (!formData.address.street.trim())
      errors["address.street"] = "Please enter your street address";

    if (!formData.address.city.trim())
      errors["address.city"] = "Please enter your city";
    else if (!isValidCity(formData.address.city))
      errors["address.city"] = "City must contain only letters";

    if (!formData.address.state.trim())
      errors["address.state"] = "Please enter your state";
    else if (!isValidState(formData.address.state))
      errors["address.state"] = "State must contain only letters";

    if (!formData.address.pincode.trim())
      errors["address.pincode"] = "Please enter your pincode";
    else if (!isValidPincode(formData.address.pincode))
      errors["address.pincode"] = "Pincode must be exactly 6 digits";

    if (!formData.password) errors.password = "Please enter a password";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword)
      errors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    return errors;
  };

  // ━━━ Auto-scroll to first error field ━━━
  const scrollToError = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) return;

    // Wait for DOM update, then scroll
    setTimeout(() => {
      const inputName = firstErrorKey.includes(".")
        ? firstErrorKey
        : firstErrorKey;
      const el = document.querySelector(`[name="${inputName}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
        el.classList.add("shake");
        setTimeout(() => el.classList.remove("shake"), 500);
      }
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    // Validate
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      scrollToError(errors);
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
    });
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setGeneralError(result.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getError = (field) => fieldErrors[field];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-header">
            <div className="auth-icon">🌟</div>
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join MealMate and start ordering</p>
          </div>

          {generalError && <div className="auth-error">{generalError}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  className={`form-input ${getError("name") ? "input-error" : ""}`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {getError("name") && (
                <div className="field-error">⚠️ {getError("name")}</div>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${getError("email") ? "input-error" : ""}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {getError("email") && (
                <div className="field-error">⚠️ {getError("email")}</div>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-group">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${getError("phone") ? "input-error" : ""}`}
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>
              {getError("phone") ? (
                <div className="field-error">⚠️ {getError("phone")}</div>
              ) : (
                <div className="password-hint">10-digit mobile number</div>
              )}
            </div>

            {/* Address Section */}
            <div className="form-section-header">📍 Address Details</div>

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <div className="input-group">
                <span className="input-icon">🏠</span>
                <input
                  type="text"
                  name="address.street"
                  className={`form-input ${getError("address.street") ? "input-error" : ""}`}
                  placeholder="House no, Street, Area"
                  value={formData.address.street}
                  onChange={handleChange}
                />
              </div>
              {getError("address.street") && (
                <div className="field-error">
                  ⚠️ {getError("address.street")}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="address.city"
                  className={`form-input ${getError("address.city") ? "input-error" : ""}`}
                  placeholder="City"
                  value={formData.address.city}
                  onChange={handleChange}
                />
                {getError("address.city") && (
                  <div className="field-error">
                    ⚠️ {getError("address.city")}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="address.state"
                  className={`form-input ${getError("address.state") ? "input-error" : ""}`}
                  placeholder="State"
                  value={formData.address.state}
                  onChange={handleChange}
                />
                {getError("address.state") && (
                  <div className="field-error">
                    ⚠️ {getError("address.state")}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                name="address.pincode"
                className={`form-input ${getError("address.pincode") ? "input-error" : ""}`}
                placeholder="6-digit pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                maxLength={6}
                inputMode="numeric"
              />
              {getError("address.pincode") && (
                <div className="field-error">
                  ⚠️ {getError("address.pincode")}
                </div>
              )}
            </div>

            {/* Password Section */}
            <div className="form-section-header">🔒 Security</div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-input ${getError("password") ? "input-error" : ""}`}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {getError("password") ? (
                <div className="field-error">⚠️ {getError("password")}</div>
              ) : (
                <div className="password-hint">Minimum 6 characters</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-icon">🔐</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className={`form-input ${getError("confirmPassword") ? "input-error" : ""}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {getError("confirmPassword") && (
                <div className="field-error">
                  ⚠️ {getError("confirmPassword")}
                </div>
              )}
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" required />I agree to the{" "}
                <NavLink to="/terms" className="auth-link">
                  Terms & Conditions
                </NavLink>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <NavLink to="/login" className="auth-link">
                Login here
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
