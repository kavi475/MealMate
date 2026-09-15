import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../css/Payment.css";

export const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [success, setSuccess] = useState(false);

  // ✅ Get order data from Checkout page
  const orderData = location.state || {
    orderId: "ORD-2024-001",
    total: 537,
    subtotal: 497,
    deliveryCharge: 40,
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
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // ✅ Navigate to Order Confirmation with order data
      setTimeout(() => {
        navigate("/order-confirmation", {
          state: {
            orderId: orderData.orderId,
            date: orderData.date || new Date().toLocaleString(),
            total: orderData.total,
            items: orderData.items,
            deliveryAddress: orderData.deliveryAddress,
            estimatedDelivery: orderData.estimatedDelivery,
            paymentMethod:
              paymentMethod === "card"
                ? "Card"
                : paymentMethod === "upi"
                  ? "UPI"
                  : "Net Banking",
          },
        });
      }, 1500);
    }, 2000);
  };

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1 className="page-title">💳 Payment</h1>
          <p className="page-subtitle">Complete your payment securely</p>
        </div>

        <div className="payment-content">
          <div className="payment-card">
            {/* Order Summary */}
            <div className="payment-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Order ID</span>
                <span>{orderData.orderId}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{orderData.subtotal || orderData.total - 40}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span>₹{orderData.deliveryCharge || 40}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{orderData.total}</span>
              </div>
            </div>

            <form onSubmit={handlePayment} className="payment-form">
              {/* Payment Methods */}
              <div className="payment-methods">
                <label
                  className={`method-option ${paymentMethod === "card" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span className="method-icon">💳</span>
                  <span className="method-name">Card</span>
                </label>

                <label
                  className={`method-option ${paymentMethod === "upi" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                  />
                  <span className="method-icon">📱</span>
                  <span className="method-name">UPI</span>
                </label>

                <label
                  className={`method-option ${paymentMethod === "netbanking" ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={paymentMethod === "netbanking"}
                    onChange={() => setPaymentMethod("netbanking")}
                  />
                  <span className="method-icon">🏦</span>
                  <span className="method-name">Net Banking</span>
                </label>
              </div>

              {/* Card Details */}
              {paymentMethod === "card" && (
                <div className="card-details">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              {/* UPI Details */}
              {paymentMethod === "upi" && (
                <div className="upi-details">
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="john@upi"
                      required
                    />
                  </div>
                  <div className="upi-apps">
                    <span>Pay with:</span>
                    <div className="app-icons">
                      <span>📱 GPay</span>
                      <span>📱 PhonePe</span>
                      <span>📱 Paytm</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking Details */}
              {paymentMethod === "netbanking" && (
                <div className="netbanking-details">
                  <div className="form-group">
                    <label>Select Bank</label>
                    <select className="form-input" required>
                      <option value="">Select your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {success && (
                <div className="success-message">
                  ✅ Payment successful! Redirecting...
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Processing...
                  </>
                ) : (
                  `Pay ₹${orderData.total}`
                )}
              </button>

              <NavLink to="/checkout" className="back-link">
                ← Back to Checkout
              </NavLink>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
