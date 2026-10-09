import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { generateUPILink, isValidUPIId } from "../utils/upiPyament";
import "../css/Checkout.css";

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upiMode, setUpiMode] = useState("qr");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    },
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    upiId: "",
    specialInstructions: "",
    saveAddress: false,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const COLLEGE_ADDRESS = {
    street: "College Canteen, Block A",
    city: "University City",
    state: "Delhi", // ⭐ FIX: Ensures state is always present for College
    pincode: "110002",
    landmark: "Main Canteen Building",
  };

  const userHasAddress =
    user?.address?.street && user?.address?.city && user?.address?.pincode;

  const addressOptions = [];

  if (userHasAddress) {
    addressOptions.push({
      id: "home",
      label: "Home",
      icon: "🏠",
      subtitle: "Your saved address",
      address: {
        street: user.address.street,
        city: user.address.city,
        state: user.address.state || "Delhi", // ⭐ FIX: Fallback state if missing
        pincode: user.address.pincode,
        landmark: user.address.landmark || "",
      },
    });
  }

  addressOptions.push({
    id: "college",
    label: "College",
    icon: "🏫",
    subtitle: "Self pickup at canteen",
    address: COLLEGE_ADDRESS,
  });

  addressOptions.push({
    id: "other",
    label: "Other",
    icon: "➕",
    subtitle: "Enter a new address",
    address: { street: "", city: "", state: "", pincode: "", landmark: "" },
  });

  const [selectedAddressType, setSelectedAddressType] = useState(
    userHasAddress ? "home" : "college",
  );

  useEffect(() => {
    const option = addressOptions.find((o) => o.id === selectedAddressType);
    if (option && option.id !== "other") {
      setFormData((prev) => ({
        ...prev,
        address: { ...option.address },
      }));
    } else if (option && option.id === "other") {
      setFormData((prev) => ({
        ...prev,
        address: { street: "", city: "", state: "", pincode: "", landmark: "" },
      }));
    }
  }, [selectedAddressType, user]);

  const deliveryCharge = selectedAddressType === "college" ? 0 : 40;
  const total = subtotal + deliveryCharge;
  const isSelfPickup = selectedAddressType === "college";

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: "💳" },
    { id: "upi", label: "UPI", icon: "📱" },
    { id: "cod", label: "Cash on Delivery", icon: "💰" },
  ];

  const isValidName = (name) => /^[A-Za-z\s]{2,50}$/.test(name);
  const isValidPhone = (phone) => /^[0-9]{10,15}$/.test(phone);
  const isValidPincode = (pincode) => /^[0-9]{6}$/.test(pincode);
  const isValidCity = (city) => /^[A-Za-z\s]{2,50}$/.test(city);
  const isValidState = (state) => /^[A-Za-z\s]{2,50}$/.test(state);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError("");

    if (name === "cardNumber") {
      setFormData({ ...formData, cardNumber: formatCardNumber(value) });
      return;
    }

    if (name === "cardExpiry") {
      setFormData({ ...formData, cardExpiry: formatExpiry(value) });
      return;
    }

    if (name === "cardCvv") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      setFormData({ ...formData, cardCvv: digits });
      return;
    }

    if (name === "cardName") {
      if (value && !/^[A-Za-z\s]*$/.test(value)) return;
      setFormData({ ...formData, cardName: value });
      return;
    }

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
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // ━━━ STEP 1 → STEP 2 VALIDATION (FIXED) ━━━
  const handleContinueToPayment = () => {
    setError("");
    const errors = [];

    // ⭐ FIX: Only validate street, city, state, pincode if NOT College pickup
    // If it's College, the data is already hardcoded and valid.
    if (selectedAddressType !== "college") {
      if (!formData.address.street.trim()) errors.push("Street address");
      if (!formData.address.city.trim()) errors.push("City");
      else if (!isValidCity(formData.address.city))
        errors.push("City (letters only)");

      // ⭐ THIS IS THE FIX FOR YOUR ERROR
      if (!formData.address.state || !formData.address.state.trim()) {
        errors.push("State");
      } else if (!isValidState(formData.address.state)) {
        errors.push("State (letters only)");
      }

      if (!formData.address.pincode.trim()) errors.push("Pincode");
      else if (!isValidPincode(formData.address.pincode))
        errors.push("Pincode (6 digits)");
    }

    if (errors.length > 0) {
      setError(`Please fill: ${errors.join(", ")}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToAddress = () => {
    setError("");
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validatePayment = () => {
    if (formData.paymentMethod === "card") {
      const cleanCard = formData.cardNumber.replace(/\s/g, "");
      if (cleanCard.length !== 16) return "Card number must be 16 digits";
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry))
        return "Expiry must be in MM/YY format";
      const [mm] = formData.cardExpiry.split("/");
      if (parseInt(mm) < 1 || parseInt(mm) > 12) return "Invalid expiry month";
      if (formData.cardCvv.length < 3) return "CVV must be 3-4 digits";
      if (!formData.cardName.trim()) return "Please enter cardholder name";
    }

    if (formData.paymentMethod === "upi") {
      if (upiMode === "id") {
        if (!formData.upiId.trim()) return "Please enter UPI ID";
        if (!isValidUPIId(formData.upiId)) {
          return "Invalid UPI ID. Format should be username@bank";
        }
      }
    }
    return null;
  };

  const handlePlaceOrder = async () => {
    setError("");

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      navigate("/cart");
      return;
    }

    const paymentError = validatePayment();
    if (paymentError) {
      setError(paymentError);
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
          state: formData.address.state, // ⭐ Ensures state is sent
          pincode: formData.address.pincode,
        },
        estimatedDelivery: isSelfPickup
          ? "Ready in 15-20 minutes"
          : "15-20 minutes",
        paymentMethod:
          paymentMethods.find((m) => m.id === formData.paymentMethod)?.label ||
          "Card",
        orderType: isSelfPickup ? "Self Pickup" : "Delivery",
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
      setError(error.response?.data?.error || "Failed to place order");
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
            {step === 1
              ? "Step 1: Choose your delivery address"
              : "Step 2: Select your payment method"}
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
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <div className="checkout-content">
          <div className="checkout-left">
            {step === 1 && (
              <>
                <div className="checkout-section">
                  <h2 className="section-title">👤 Contact Information</h2>
                  <div className="locked-user-info">
                    <div className="locked-user-field">
                      <span className="locked-label">Full Name</span>
                      <span className="locked-value">{user?.name || "—"}</span>
                    </div>
                    <div className="locked-user-field">
                      <span className="locked-label">Email</span>
                      <span className="locked-value">{user?.email || "—"}</span>
                    </div>
                    <div className="locked-user-field">
                      <span className="locked-label">Phone</span>
                      <span className="locked-value">{user?.phone || "—"}</span>
                    </div>
                  </div>
                  <div className="locked-info-note">
                    ℹ️ Need to change your details?{" "}
                    <NavLink to="/profile" className="profile-link">
                      Update in Profile →
                    </NavLink>
                  </div>
                </div>

                <div className="checkout-section">
                  <h2 className="section-title">📍 Delivery Address</h2>
                  <label className="section-label">
                    Where should we deliver?
                  </label>
                  <div className="address-options">
                    {addressOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`address-option ${
                          selectedAddressType === option.id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedAddressType(option.id)}
                      >
                        <div className="address-option-header">
                          <span className="address-label">
                            {option.icon} {option.label}
                          </span>
                          {selectedAddressType === option.id && (
                            <span className="address-check">✓</span>
                          )}
                        </div>
                        <p className="address-detail">{option.subtitle}</p>
                        {option.id !== "other" && (
                          <p className="address-full">
                            {option.address.street}, {option.address.city} -{" "}
                            {option.address.pincode}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedAddressType === "college" ? (
                    <div className="delivery-info-banner pickup">
                      🏫 Self-Pickup • No delivery charge. Pick up your order at
                      the canteen.
                    </div>
                  ) : (
                    <div className="delivery-info-banner delivery">
                      🚚 Delivery to your address • ₹40 delivery charge applies.
                    </div>
                  )}

                  {selectedAddressType === "other" && (
                    <div className="address-form">
                      <div className="form-group">
                        <label className="form-label">Street Address *</label>
                        <input
                          type="text"
                          name="address.street"
                          className="form-input"
                          value={formData.address.street}
                          onChange={handleChange}
                          placeholder="Enter full street address"
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
                            placeholder="Letters only"
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
                            placeholder="Letters only"
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
                            placeholder="6 digits"
                            maxLength={6}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">
                            Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            name="address.landmark"
                            className="form-input"
                            value={formData.address.landmark}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">
                      📝 Special Instructions (Optional)
                    </label>
                    <textarea
                      name="specialInstructions"
                      className="form-textarea"
                      placeholder="Any special requests?"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block continue-btn"
                  onClick={handleContinueToPayment}
                >
                  Continue to Payment Method →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="checkout-section">
                  <h2 className="section-title">
                    {isSelfPickup ? "🏫 Pickup From" : "📍 Delivering To"}
                  </h2>
                  <div className="chosen-address">
                    <p className="chosen-address-name">
                      <strong>{user?.name}</strong>
                    </p>
                    <p className="chosen-address-line">
                      {formData.address.street}, {formData.address.city},{" "}
                      {formData.address.state} - {formData.address.pincode}
                    </p>
                    <p className="chosen-address-contact">
                      📞 {user?.phone} | ✉️ {user?.email}
                    </p>
                    {isSelfPickup && (
                      <p className="pickup-note">
                        🏫 Self-Pickup order — no delivery charge
                      </p>
                    )}
                    <button
                      type="button"
                      className="change-address-btn"
                      onClick={handleBackToAddress}
                    >
                      ✏️ Change Address
                    </button>
                  </div>
                </div>

                <div className="checkout-section">
                  <h2 className="section-title">💳 Select Payment Method</h2>
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
                          name="cardNumber"
                          className="form-input"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          maxLength={19}
                          inputMode="numeric"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Expiry Date</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            className="form-input"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            maxLength={5}
                            inputMode="numeric"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV</label>
                          <input
                            type="text"
                            name="cardCvv"
                            className="form-input"
                            placeholder="123"
                            value={formData.cardCvv}
                            onChange={handleChange}
                            maxLength={4}
                            inputMode="numeric"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Cardholder Name</label>
                        <input
                          type="text"
                          name="cardName"
                          className="form-input"
                          placeholder="Name on card"
                          value={formData.cardName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "upi" && (
                    <div className="upi-details">
                      <div className="upi-tabs">
                        <button
                          type="button"
                          className={`upi-tab ${upiMode === "qr" ? "active" : ""}`}
                          onClick={() => setUpiMode("qr")}
                        >
                          📱 Scan QR Code
                        </button>
                        <button
                          type="button"
                          className={`upi-tab ${upiMode === "id" ? "active" : ""}`}
                          onClick={() => setUpiMode("id")}
                        >
                          ⌨️ Enter UPI ID
                        </button>
                      </div>

                      {upiMode === "qr" && (
                        <div className="upi-qr-section">
                          <p className="upi-qr-label">
                            Scan this QR with any UPI app
                          </p>
                          <div className="qr-wrapper">
                            <QRCode
                              value={generateUPILink({
                                upiId: "mealmate@upi",
                                name: "MealMate Canteen",
                                amount: total,
                                note: "MealMate Order",
                              })}
                              size={200}
                              level="H"
                              bgColor="#ffffff"
                              fgColor="#1f2937"
                            />
                            <div className="qr-amount-badge">₹{total}</div>
                          </div>
                          <p className="upi-qr-helper">
                            Open GPay, PhonePe, Paytm, or any UPI app
                          </p>
                          <div className="upi-apps-row">
                            <a
                              href={generateUPILink({
                                upiId: "mealmate@upi",
                                name: "MealMate Canteen",
                                amount: total,
                                note: "MealMate Order",
                              })}
                              className="upi-app-btn"
                            >
                              <span>📱</span>
                              <span>Open UPI App</span>
                            </a>
                          </div>
                          <div className="upi-info-banner">
                            ⓘ After payment, click "Place Order" below
                          </div>
                        </div>
                      )}

                      {upiMode === "id" && (
                        <div className="upi-id-section">
                          <div className="form-group">
                            <label className="form-label">Your UPI ID</label>
                            <input
                              type="text"
                              name="upiId"
                              className={`form-input ${
                                formData.upiId && !isValidUPIId(formData.upiId)
                                  ? "input-error"
                                  : formData.upiId &&
                                      isValidUPIId(formData.upiId)
                                    ? "input-success"
                                    : ""
                              }`}
                              placeholder="yourname@upi"
                              value={formData.upiId}
                              onChange={handleChange}
                              autoComplete="off"
                            />
                            {formData.upiId &&
                              !isValidUPIId(formData.upiId) && (
                                <div className="field-error">
                                  ⚠️ Invalid UPI ID. Format: username@bank
                                </div>
                              )}
                            {formData.upiId && isValidUPIId(formData.upiId) && (
                              <div className="field-success">
                                ✅ Valid UPI ID
                              </div>
                            )}
                            {!formData.upiId && (
                              <div className="password-hint">
                                Example: johndoe@okhdfcbank or 9876543210@ybl
                              </div>
                            )}
                          </div>
                          <div className="upi-apps-row">
                            <span className="upi-apps-label">Pay using:</span>
                            <div className="upi-apps-list">
                              <span className="upi-app-chip">📱 GPay</span>
                              <span className="upi-app-chip">📱 PhonePe</span>
                              <span className="upi-app-chip">📱 Paytm</span>
                              <span className="upi-app-chip">📱 BHIM</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.paymentMethod === "cod" && (
                    <div className="cod-note">
                      💰 Pay ₹{total} in cash when your order is{" "}
                      {isSelfPickup ? "picked up" : "delivered"}.
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block place-order-btn"
                  onClick={handlePlaceOrder}
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

                <button
                  type="button"
                  className="back-to-address-btn"
                  onClick={handleBackToAddress}
                  disabled={loading}
                >
                  ← Back to Address
                </button>
              </>
            )}
          </div>

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
                  <span>
                    {isSelfPickup ? "Self Pickup" : "Delivery Charge"}
                  </span>
                  <span className={isSelfPickup ? "free-charge" : ""}>
                    {isSelfPickup ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="pricing-divider"></div>
                <div className="pricing-row total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <NavLink to="/cart" className="back-to-cart">
                ← Back to Cart
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
