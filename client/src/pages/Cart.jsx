import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../css/Cart.css";

export const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    deliveryCharge,
    total,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [processingId, setProcessingId] = useState(null);

  const handleUpdateQuantity = async (menuItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setProcessingId(menuItemId);
    await updateQuantity(menuItemId, newQuantity);
    setProcessingId(null);
  };

  const handleRemove = async (menuItemId) => {
    if (!window.confirm("Remove this item?")) return;
    setProcessingId(menuItemId);
    await removeFromCart(menuItemId);
    setProcessingId(null);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
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
            <div className="cart-items-section">
              <div className="cart-actions-top">
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  🗑️ Clear Cart
                </button>
              </div>

              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.menuItemId} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-img"
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = "flex";
                          }
                        }}
                      />
                      <span className="item-emoji" style={{ display: "none" }}>
                        🍽️
                      </span>
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <span className="cart-item-price">₹{item.price}</span>
                      </div>

                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.menuItemId,
                                item.quantity - 1,
                              )
                            }
                            disabled={
                              item.quantity <= 1 ||
                              processingId === item.menuItemId
                            }
                          >
                            −
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.menuItemId,
                                item.quantity + 1,
                              )
                            }
                            disabled={processingId === item.menuItemId}
                          >
                            +
                          </button>
                        </div>

                        <span className="item-total">
                          ₹{item.price * item.quantity}
                        </span>

                        <button
                          className="remove-item-btn"
                          onClick={() => handleRemove(item.menuItemId)}
                          title="Remove item"
                          disabled={processingId === item.menuItemId}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="total-amount">₹{total}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-block checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout →
              </button>

              <NavLink to="/menu" className="continue-shopping">
                ← Continue Shopping
              </NavLink>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <NavLink to="/menu" className="btn btn-primary btn-lg">
              Browse Menu
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};
