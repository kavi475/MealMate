import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../utils/api";
import "../css/Contact.css";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // ━━━ Validation helpers ━━━
  const isValidName = (name) => /^[A-Za-z\s]{2,50}$/.test(name);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ⭐ Subject must contain at least one letter
  const isValidSubject = (subject) => {
    const trimmed = subject.trim();
    if (trimmed.length < 3 || trimmed.length > 100) return false;
    if (!/[A-Za-z]/.test(trimmed)) return false;
    return true;
  };

  // ⭐ Message must contain at least one letter
  const isValidMessage = (message) => {
    const trimmed = message.trim();
    if (trimmed.length < 10 || trimmed.length > 1000) return false;
    if (!/[A-Za-z]/.test(trimmed)) return false;
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
    setGeneralError("");

    // Name: letters + spaces only
    if (name === "name") {
      if (value && !/^[A-Za-z\s]*$/.test(value)) return;
      setFormData({ ...formData, name: value });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Please enter your name";
    } else if (!isValidName(formData.name)) {
      errors.name = "Name must contain only letters (2-50 characters)";
    }

    if (!formData.email.trim()) {
      errors.email = "Please enter your email";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Please enter a subject";
    } else if (!isValidSubject(formData.subject)) {
      errors.subject =
        "Subject must be 3-100 characters and contain at least one letter";
    }

    if (!formData.message.trim()) {
      errors.message = "Please enter your message";
    } else if (!isValidMessage(formData.message)) {
      errors.message =
        "Message must be 10-1000 characters and contain at least one letter";
    }

    return errors;
  };

  const scrollToError = (errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) return;

    setTimeout(() => {
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
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
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      scrollToError(errors);
      return;
    }

    setLoading(true);

    try {
      await api.post("/contact", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      console.error("Contact form error:", err);
      setGeneralError(
        err.response?.data?.error ||
          "Failed to send message. Please try again.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  const getError = (field) => fieldErrors[field];

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1 className="page-title">📬 Contact Us</h1>
          <p className="page-subtitle">
            We'd love to hear from you! Reach out to us anytime.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-left">
            <div className="contact-info-card">
              <h2 className="info-title">Get in Touch</h2>
              <p className="info-description">
                Have a question, feedback, or suggestion? We're here to help!
              </p>

              <div className="info-items">
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <div>
                    <h4>Address</h4>
                    <p>123 Campus Road, University City, Delhi - 110001</p>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">📞</span>
                  <div>
                    <h4>Phone</h4>
                    <p>+91 98765 43210</p>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">✉️</span>
                  <div>
                    <h4>Email</h4>
                    <p>support@mealmate.com</p>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-icon">🕐</span>
                  <div>
                    <h4>Working Hours</h4>
                    <p>Mon - Sat: 8:00 AM - 10:00 PM</p>
                    <p>Sunday: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <span className="social-label">Follow us:</span>
                <div className="social-icons">
                  <a href="#" className="social-icon">
                    📘
                  </a>
                  <a href="#" className="social-icon">
                    🐦
                  </a>
                  <a href="#" className="social-icon">
                    📸
                  </a>
                  <a href="#" className="social-icon">
                    ▶️
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-right">
            <div className="contact-form-card">
              <h2 className="form-title">Send Us a Message</h2>

              {success && (
                <div className="success-message">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {generalError && (
                <div className="error-banner">⚠️ {generalError}</div>
              )}

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-input ${getError("name") ? "input-error" : ""}`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={50}
                  />
                  {getError("name") && (
                    <div className="field-error">⚠️ {getError("name")}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-input ${getError("email") ? "input-error" : ""}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={100}
                  />
                  {getError("email") && (
                    <div className="field-error">⚠️ {getError("email")}</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    className={`form-input ${getError("subject") ? "input-error" : ""}`}
                    placeholder="Enter subject (e.g., Order issue, Feedback)"
                    value={formData.subject}
                    onChange={handleChange}
                    maxLength={100}
                  />
                  {getError("subject") ? (
                    <div className="field-error">⚠️ {getError("subject")}</div>
                  ) : (
                    <div className="password-hint">
                      Must contain letters (not only numbers)
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    className={`form-textarea ${getError("message") ? "input-error" : ""}`}
                    placeholder="Write your message here..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={1000}
                  />
                  <div className="char-counter">
                    {formData.message.length} / 1000
                  </div>
                  {getError("message") && (
                    <div className="field-error">⚠️ {getError("message")}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
