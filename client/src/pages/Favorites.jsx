import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import "../css/Favorites.css";

export const Favorites = () => {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get("/favorites");
      setFavorites(response.data.items || []);
      setError("");
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError(err.response?.data?.error || "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (id) => {
    if (!window.confirm("Remove from favorites?")) return;

    setProcessingId(id);
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to remove favorite");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAddToCart = async (item) => {
    setProcessingId(item._id);
    const result = await addToCart(item, 1);
    setProcessingId(null);

    if (result.success) {
      alert(`${item.name} added to cart!`);
    } else {
      alert(result.error);
    }
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="favorites-header">
          <h1 className="page-title">❤️ My Favorites</h1>
          <p className="page-subtitle">
            {favorites.length > 0
              ? `You have ${favorites.length} favorite item${favorites.length > 1 ? "s" : ""}`
              : "No favorites yet"}
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {favorites.length > 0 ? (
          <div className="favorites-grid">
            {favorites.map((item) => (
              <div key={item._id} className="favorite-card">
                <div className="favorite-card-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="favorite-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {item.veg && <span className="veg-badge">🌱</span>}
                  <button
                    className="remove-favorite-btn"
                    onClick={() => removeFavorite(item._id)}
                    disabled={processingId === item._id}
                    title="Remove from favorites"
                  >
                    {processingId === item._id ? "⏳" : "✕"}
                  </button>
                </div>

                <div className="favorite-card-body">
                  <h3 className="favorite-item-name">{item.name}</h3>
                  <div className="favorite-item-meta">
                    <span className="favorite-item-rating">
                      ⭐ {item.rating}
                    </span>
                    <span className="favorite-item-price">₹{item.price}</span>
                  </div>
                  <div className="favorite-item-actions">
                    <NavLink
                      to={`/menu/${item._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Item
                    </NavLink>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleAddToCart(item)}
                      disabled={processingId === item._id}
                    >
                      {processingId === item._id ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <div className="empty-icon">❤️</div>
            <h3>No favorites yet</h3>
            <p>Start adding your favorite items by clicking the heart icon</p>
            <NavLink to="/menu" className="btn btn-primary">
              Browse Menu
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};
