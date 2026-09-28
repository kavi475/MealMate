import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../css/MenuItemDetail.css";
import { useFavorites } from "../context/FavoritesContext";

export const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/menu/${id}`);
      setItem(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching item:", err);
      setError("Item not found");
      setTimeout(() => navigate("/menu"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAdding(true);
    const result = await addToCart(item, quantity);
    setAdding(false);

    if (result.success) {
      alert(`Added ${quantity} × ${item?.name} to cart!`);
      navigate("/cart");
    } else {
      alert(result.error);
    }
  };
  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      alert("Please login to add favorites");
      navigate("/login");
      return;
    }

    setFavLoading(true);
    const result = await toggleFavorite(item._id);
    setFavLoading(false);

    if (result.success) {
      alert(
        result.isFavorite ? "Added to favorites ❤️" : "Removed from favorites",
      );
    } else {
      alert(result.error);
    }
  };

  if (loading) {
    return (
      <div className="item-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading item details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="item-detail-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">😢</div>
            <h3>Item not found</h3>
            <p>{error || "The item you're looking for doesn't exist."}</p>
            <NavLink to="/menu" className="btn btn-primary">
              Back to Menu
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="item-detail-page">
      <div className="container">
        <NavLink to="/menu" className="back-link">
          ← Back to Menu
        </NavLink>

        <div className="item-detail-content">
          <div className="item-detail-image">
            <img
              src={item.image}
              alt={item.name}
              className="detail-image"
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x400?text=Food";
              }}
            />
            {item.veg ? (
              <span className="veg-badge">🌱 Pure Veg</span>
            ) : (
              <span className="nonveg-badge">🍖 Non-Veg</span>
            )}
            {item.isAvailable ? (
              <span className="availability-badge available">Available</span>
            ) : (
              <span className="availability-badge unavailable">
                Out of Stock
              </span>
            )}
          </div>

          <div className="item-detail-info">
            <h1 className="item-detail-name">{item.name}</h1>

            <div className="item-detail-meta">
              <span className="item-rating">⭐ {item.rating}</span>
              <span className="item-category">📂 {item.category}</span>
              <span className="item-prep">⏱️ {item.prepTime}</span>
            </div>

            <p className="item-detail-description">{item.description}</p>

            <div className="item-detail-specs">
              <span className="spec-item">🔥 {item.calories}</span>
            </div>

            <div className="item-detail-price">
              <span className="price-label">Price</span>
              <span className="price-value">₹{item.price}</span>
            </div>

            <div className="item-quantity">
              <span className="quantity-label">Quantity:</span>
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="qty-number">{quantity}</span>
                <button className="qty-btn" onClick={increaseQuantity}>
                  +
                </button>
              </div>
            </div>

            <div className="item-detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={!item.isAvailable || adding}
              >
                {adding ? "⏳ Adding..." : "🛒 Add to Cart"}
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={handleAddToFavorites}
                disabled={favLoading}
              >
                {favLoading
                  ? "⏳"
                  : isFavorite(item._id)
                    ? "❤️ Remove from Favorites"
                    : "🤍 Add to Favorites"}
              </button>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h2 className="reviews-title">📝 Customer Reviews</h2>
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        </div>
      </div>
    </div>
  );
};
