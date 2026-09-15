import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../css/OrderConfirmation.css";

export const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Get order data from location state (or use dummy data)
  const orderData = location.state || {
    orderId: "ORD-2024-001",
    date: new Date().toLocaleString(),
    total: 497,
    items: [
      {
        name: "Crispy Veg Cheese Burger",
        quantity: 2,
        price: 199,
        image: "🍔",
      },
      { name: "French Fries", quantity: 1, price: 99, image: "🍟" },
    ],
    deliveryAddress: "123 Campus Road, University City, Delhi - 110001",
    estimatedDelivery: "15-20 minutes",
    paymentMethod: "Card",
  };

  // Trigger animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate subtotal
  const subtotal = orderData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryCharge = 40;
  const total = subtotal + deliveryCharge;

  // FIXED: Track Order - Navigate to specific order tracking page
  const handleTrackOrder = () => {
    if (orderData && orderData.orderId) {
      navigate(`/order-tracking/${orderData.orderId}`);
    } else {
      navigate("/orders");
    }
  };

  return (
    <div className="confirmation-page">
      <div className="container">
        {/* Success Animation */}
        <div className={`success-animation ${isVisible ? "show" : ""}`}>
          <div className="checkmark-circle">
            <div className="checkmark-draw"></div>
          </div>
        </div>

        {/* Header */}
        <div className={`confirmation-header ${isVisible ? "show" : ""}`}>
          <h1 className="page-title">🎉 Order Placed Successfully!</h1>
          <p className="page-subtitle">
            Thank you for your order. We'll notify you when it's ready.
          </p>
        </div>

        {/* Order Details Card */}
        <div className={`confirmation-content ${isVisible ? "show" : ""}`}>
          <div className="confirmation-grid">
            {/* Left Column - Order Info */}
            <div className="confirmation-left">
              <div className="order-details-card">
                <h2 className="card-title">📋 Order Details</h2>

                <div className="order-info-grid">
                  <div className="order-info-item">
                    <span className="info-label">Order ID</span>
                    <span className="info-value">{orderData.orderId}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="info-label">Date & Time</span>
                    <span className="info-value">{orderData.date}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="info-label">Total Amount</span>
                    <span className="info-value total-price">
                      ₹{orderData.total}
                    </span>
                  </div>
                  <div className="order-info-item">
                    <span className="info-label">Payment</span>
                    <span className="info-value payment-status">
                      Paid via {orderData.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="delivery-info">
                  <h3 className="delivery-title">📍 Delivery Address</h3>
                  <p className="delivery-address">
                    {orderData.deliveryAddress}
                  </p>
                  <div className="delivery-time">
                    <span className="time-icon">⏱️</span>
                    <span>
                      Estimated Delivery:{" "}
                      <strong>{orderData.estimatedDelivery}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-summary-card">
                <h2 className="card-title">📦 Order Summary</h2>
                <div className="summary-items">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="summary-item">
                      <div className="summary-item-info">
                        <span className="summary-item-image">{item.image}</span>
                        <div>
                          <span className="summary-item-name">{item.name}</span>
                          <span className="summary-item-qty">
                            × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="summary-item-price">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="total-row">
                    <span>Delivery Charge</span>
                    <span>₹{deliveryCharge}</span>
                  </div>
                  <div className="total-row discount">
                    <span>Discount</span>
                    <span>-₹0</span>
                  </div>
                  <div className="total-divider"></div>
                  <div className="total-row grand-total">
                    <span>Total</span>
                    <span>₹{orderData.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="confirmation-right">
              <div className="actions-card">
                <h3 className="actions-title">What's Next?</h3>

                <div className="actions-grid">
                  {/* FIXED: Track Order button */}
                  <button
                    className="action-btn primary"
                    onClick={handleTrackOrder}
                  >
                    <span className="action-icon">🚚</span>
                    <div className="action-content">
                      <span className="action-label">Track Order</span>
                      <span className="action-desc">See real-time status</span>
                    </div>
                  </button>

                  <NavLink to="/menu" className="action-btn secondary">
                    <span className="action-icon">🍽️</span>
                    <div className="action-content">
                      <span className="action-label">Continue Shopping</span>
                      <span className="action-desc">Browse more items</span>
                    </div>
                  </NavLink>

                  <NavLink to="/orders" className="action-btn outline">
                    <span className="action-icon">📋</span>
                    <div className="action-content">
                      <span className="action-label">View All Orders</span>
                      <span className="action-desc">Order history</span>
                    </div>
                  </NavLink>
                </div>

                <div className="email-notice">
                  <span className="email-icon">📧</span>
                  <p>
                    A confirmation email has been sent to your registered email
                    address.
                    <br />
                    <small>Check your spam folder if you don't see it.</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
