import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import "../css/Checkout.css";

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, deliveryCharge, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@university.edu",
    phone: "+91 98765 43210",
    address: {
      street: "123 Campus Road",
      city: "University City",
      state: "Delhi",
      pincode: "110001",
      landmark: "Near Main Gate",
    },
    paymentMethod: "card",
    specialInstructions: "",
    saveAddress: false,
  });

  const [savedAddresses] = useState([
    {
      id: 1,
      label: "Home",
      street: "123 Campus Road",
      city: "University City",
      state: "Delhi",
      pincode: "110001",
    },
    {
      id: 2,
      label: "College",
      street: "Block A, College Campus",
      city: "University City",
      state: "Delhi",
      pincode: "110002",
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: "💳" },
    { id: "upi", label: "UPI", icon: "📱" },
    { id: "netbanking", label: "Net Banking", icon: "🏦" },
    { id: "cod", label: "Cash on Delivery", icon: "💰" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address.id);
    setFormData({
      ...formData,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: formData.address.landmark || "",
      },
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/cart");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (
      !formData.address.street ||
      !formData.address.city ||
      !formData.address.pincode
    ) {
      alert("Please enter your complete delivery address");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        total: total,
        deliveryAddress: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          pincode: formData.address.pincode,
        },
        estimatedDelivery: "15-20 minutes",
        paymentMethod:
          paymentMethods.find((m) => m.id === formData.paymentMethod)?.label ||
          "Card",
      };

      const response = await api.post("/orders", orderData);
      const order = response.data;

      await clearCart();

      navigate("/order-confirmation", {
        state: {
          orderId: order.orderId,
          date: new Date(order.createdAt).toLocaleString("en-IN"),
          total: order.total,
          items: order.items,
          deliveryAddress: `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}`,
          estimatedDelivery: order.estimatedDelivery,
          paymentMethod: order.paymentMethod,
        },
      });
    } catch (error) {
      console.error("Order failed:", error);
      alert(
        error.response?.data?.error ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add items to your cart before checking out.</p>
            <NavLink to="/menu" className="btn btn-primary btn-lg">
              Browse Menu
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1 className="page-title">Checkout</h1>
          <p className="page-subtitle">
            Complete your order and enjoy your meal
          </p>
        </div>

        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <span className="step-number">1</span>
            <span className="step-label">Address</span>
          </div>
          <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
          <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirm</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-content">
            <div className="checkout-left">
              {/* Address Section */}
              <div className="checkout-section">
                <h2 className="section-title">📍 Delivery Address</h2>

                {savedAddresses.length > 0 && (
                  <div className="saved-addresses">
                    <label className="section-label">
                      Select saved address
                    </label>
                    <div className="address-options">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`address-option ${
                            selectedAddress === addr.id ? "selected" : ""
                          }`}
                          onClick={() => handleAddressSelect(addr)}
                        >
                          <div className="address-option-header">
                            <span className="address-label">{addr.label}</span>
                            {selectedAddress === addr.id && (
                              <span className="address-check">✓</span>
                            )}
                          </div>
                          <p className="address-detail">{addr.street}</p>
                          <p className="address-detail">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="address-divider">OR</div>
                  </div>
                )}

                <div className="address-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-input"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street Address *</label>
                    <input
                      type="text"
                      name="address.street"
                      className="form-input"
                      value={formData.address.street}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        name="address.city"
                        className="form-input"
                        value={formData.address.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <input
                        type="text"
                        name="address.state"
                        className="form-input"
                        value={formData.address.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Pincode *</label>
                      <input
                        type="text"
                        name="address.pincode"
                        className="form-input"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Landmark (Optional)</label>
                      <input
                        type="text"
                        name="address.landmark"
                        className="form-input"
                        value={formData.address.landmark}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="saveAddress"
                        checked={formData.saveAddress}
                        onChange={handleChange}
                      />
                      Save this address for future orders
                    </label>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="checkout-section">
                <h2 className="section-title">💳 Payment Method</h2>
                <div className="payment-methods">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`payment-method ${
                        formData.paymentMethod === method.id ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                      />
                      <span className="payment-icon">{method.icon}</span>
                      <span className="payment-label">{method.label}</span>
                    </label>
                  ))}
                </div>

                {formData.paymentMethod === "card" && (
                  <div className="card-details">
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cardholder Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "upi" && (
                  <div className="upi-details">
                    <div className="form-group">
                      <label className="form-label">UPI ID</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="john@upi"
                      />
                    </div>
                    <div className="upi-apps">
                      <span className="upi-label">Pay with:</span>
                      <div className="upi-icons">
                        <span className="upi-icon">📱 GPay</span>
                        <span className="upi-icon">📱 PhonePe</span>
                        <span className="upi-icon">📱 Paytm</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="checkout-section">
                <h2 className="section-title">📝 Special Instructions</h2>
                <div className="form-group">
                  <textarea
                    name="specialInstructions"
                    className="form-textarea"
                    placeholder="Any special requests? (e.g., extra spicy, no onions, etc.)"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="checkout-right">
              <div className="order-summary-card">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-items">
                  {cartItems.map((item) => (
                    <div key={item.menuItemId} className="summary-item">
                      <div className="summary-item-info">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="summary-item-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="summary-item-details">
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

                <div className="summary-pricing">
                  <div className="pricing-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="pricing-row">
                    <span>Delivery Charge</span>
                    <span>₹{deliveryCharge}</span>
                  </div>
                  <div className="pricing-row discount">
                    <span>Discount</span>
                    <span>-₹0</span>
                  </div>
                  <div className="pricing-divider"></div>
                  <div className="pricing-row total">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <div className="promo-section">
                  <input
                    type="text"
                    className="promo-input"
                    placeholder="Enter promo code"
                  />
                  <button type="button" className="promo-btn">
                    Apply
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block place-order-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Placing Order...
                    </>
                  ) : (
                    `Place Order • ₹${total}`
                  )}
                </button>

                <NavLink to="/cart" className="back-to-cart">
                  ← Back to Cart
                </NavLink>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
