import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/Favorites.css";

export const Favorites = () => {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Crispy Veg Cheese Burger",
      price: 199,
      image: "🍔",
      rating: 4.5,
      veg: true,
    },
    {
      id: 3,
      name: "Special Masala Dosa",
      price: 129,
      image: "🥞",
      rating: 4.7,
      veg: true,
    },
    {
      id: 8,
      name: "Gulab Jamun",
      price: 79,
      image: "🍡",
      rating: 4.9,
      veg: true,
    },
  ]);

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

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

        {favorites.length > 0 ? (
          <div className="favorites-grid">
            {favorites.map((item) => (
              <div key={item.id} className="favorite-card">
                <div className="favorite-card-image">
                  <span className="food-emoji">{item.image}</span>
                  {item.veg && <span className="veg-badge">🌱</span>}
                  <button
                    className="remove-favorite-btn"
                    onClick={() => removeFavorite(item.id)}
                  >
                    ✕
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
                      to={`/menu/${item.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Item
                    </NavLink>
                    <button className="btn btn-secondary btn-sm">
                      Add to Cart
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
