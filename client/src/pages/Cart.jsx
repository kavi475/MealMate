import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Cart.css";

export const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Crispy Veg Cheese Burger",
      price: 199,
      quantity: 2,
      image: "🍔",
      veg: true,
      description: "Crunchy veggie patty with double cheddar",
    },
    {
      id: 2,
      name: "Paneer Tikka Pizza",
      price: 249,
      quantity: 1,
      image: "🍕",
      veg: true,
      description: "Spicy marinated paneer cubes with capsicum",
    },
    {
      id: 4,
      name: "Chicken Tikka Roll",
      price: 179,
      quantity: 3,
      image: "🌯",
      veg: false,
      description: "Tender chicken tikka wrapped with onions",
    },
  ]);

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setCartItems([]);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryCharge = subtotal > 0 ? 40 : 0;
  const total = subtotal + deliveryCharge;

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <div className="container">
        {/* Page Header */}
        <div className="cart-header">
          <h1 className="page-title">Your Cart</h1>
          <p className="page-subtitle">
            {cartItems.length > 0
              ? `You have ${cartItems.length} item${cartItems.length > 1 ? "s" : ""} in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items-section">
              {/* Clear Cart Button */}
              <div className="cart-actions-top">
                <button className="clear-cart-btn" onClick={clearCart}>
                  🗑️ Clear Cart
                </button>
              </div>

              {/* Items List */}
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <span className="item-emoji">{item.image}</span>
                      {item.veg && <span className="veg-dot">🌱</span>}
                      {!item.veg && <span className="nonveg-dot">🍖</span>}
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <span className="cart-item-price">₹{item.price}</span>
                      </div>
                      <p className="cart-item-description">
                        {item.description}
                      </p>

                      <div className="cart-item-controls">
                        {/* Quantity Controls */}
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <span className="item-total">
                          ₹{item.price * item.quantity}
                        </span>

                        {/* Remove Button */}
                        <button
                          className="remove-item-btn"
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Right Side */}
            <div className="order-summary">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryCharge > 0 ? `₹${deliveryCharge}` : "Free"}
                  </span>
                </div>
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span className="discount-amount">-₹0</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="total-amount">₹{total}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="promo-section">
                <input
                  type="text"
                  className="promo-input"
                  placeholder="Enter promo code"
                />
                <button className="promo-btn">Apply</button>
              </div>

              {/* Checkout Button */}
              <button
                className="btn btn-primary btn-block checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout →
              </button>

              {/* Continue Shopping */}
              <NavLink to="/menu" className="continue-shopping">
                ← Continue Shopping
              </NavLink>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <NavLink to="/menu" className="btn btn-primary btn-lg">
              Browse Menu
            </NavLink>
          </div>
        )}

        {/* Recommended Items */}
        {cartItems.length > 0 && (
          <div className="recommended-section">
            <h2 className="recommended-title">You might also like</h2>
            <div className="recommended-grid">
              <div className="recommended-card">
                <span className="rec-emoji">🍟</span>
                <h4>French Fries</h4>
                <p>₹99</p>
                <button className="btn btn-secondary btn-sm">Add</button>
              </div>
              <div className="recommended-card">
                <span className="rec-emoji">🥤</span>
                <h4>Cold Drink</h4>
                <p>₹49</p>
                <button className="btn btn-secondary btn-sm">Add</button>
              </div>
              <div className="recommended-card">
                <span className="rec-emoji">🍰</span>
                <h4>Chocolate Cake</h4>
                <p>₹129</p>
                <button className="btn btn-secondary btn-sm">Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
