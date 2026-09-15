import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header */}
        <div className="contact-header">
          <h1 className="page-title">📬 Contact Us</h1>
          <p className="page-subtitle">
            We'd love to hear from you! Reach out to us anytime.
          </p>
        </div>

        <div className="contact-content">
          {/* Left Column - Contact Info */}
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

          {/* Right Column - Contact Form */}
          <div className="contact-right">
            <div className="contact-form-card">
              <h2 className="form-title">Send Us a Message</h2>

              {success && (
                <div className="success-message">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    className="form-input"
                    placeholder="Enter subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    name="message"
                    className="form-textarea"
                    placeholder="Write your message here..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
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
