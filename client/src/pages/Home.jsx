import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import "../css/Home.css";

const Home = () => {
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Breakfast", icon: "🍳", slug: "breakfast" },
    { name: "Snacks", icon: "🍿", slug: "snacks" },
    { name: "Fast Food", icon: "🍔", slug: "snacks" },
    { name: "Main Course", icon: "🍛", slug: "lunch" },
    { name: "Beverages", icon: "🥤", slug: "beverages" },
    { name: "Desserts", icon: "🍰", slug: "desserts" },
  ];

  const features = [
    {
      icon: "⚡",
      title: "Quick Ordering",
      description:
        "Browse the menu, customize your meal, and checkout in seconds.",
    },
    {
      icon: "🚫",
      title: "No Long Queues",
      description:
        "Pre-order before class ends and pick up your hot food immediately.",
    },
    {
      icon: "📱",
      title: "Easy Tracking",
      description: "Get real-time updates on your order status.",
    },
  ];

  // Fetch popular items
  useEffect(() => {
    fetchPopularItems();
  }, []);

  const fetchPopularItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/menu/popular?limit=4");
      setPopularItems(response.data.items || []);
    } catch (err) {
      console.error("Error fetching popular items:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Delicious Food.
              <br />
              <span className="highlight">Made for Campus Life.</span>
            </h1>
            <p className="hero-description">
              Skip the queues and satisfy your cravings instantly. Fresh, hot
              meals ready when you are between classes.
            </p>
            <div className="hero-buttons">
              <Link to="/menu" className="btn btn-primary btn-lg">
                Order Now
              </Link>
              <Link to="/menu" className="btn btn-secondary btn-lg">
                Explore Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="craving-section">
        <div className="container">
          <h2 className="section-title">What are you craving today?</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link to="/menu" key={index} className="category-card">
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CRAVINGS BY CATEGORY */}
      <section className="category-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Cravings by Category</h2>
            <Link to="/menu" className="view-all-link">
              View All →
            </Link>
          </div>
          <p className="section-subtitle">
            Find exactly what you're looking for.
          </p>
        </div>
      </section>

      {/* POPULAR ON CAMPUS */}
      <section className="popular-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular on Campus</h2>
            <span className="popular-badge">
              The most loved items this week.
            </span>
          </div>

          {loading ? (
            <div className="home-loading">
              <div className="spinner"></div>
              <p>Loading popular items...</p>
            </div>
          ) : popularItems.length > 0 ? (
            <div className="popular-grid">
              {popularItems.map((item) => (
                <Link
                  to={`/menu/${item._id}`}
                  key={item._id}
                  className="popular-card"
                >
                  <div className="popular-card-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="popular-food-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Food";
                      }}
                    />
                  </div>
                  <div className="popular-card-body">
                    <h3 className="popular-item-name">{item.name}</h3>
                    <p className="popular-item-description">
                      {item.description}
                    </p>
                    <div className="popular-item-footer">
                      <span className="popular-item-price">₹{item.price}</span>
                      <span className="popular-item-rating">
                        ⭐ {item.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="home-empty">
              <p>No popular items yet.</p>
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/menu" className="btn btn-primary">
              See Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* WHY USE MEALMATE */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Use MealMate?</h2>
          <p className="section-subtitle centered">
            Designed to make your campus dining experience smoother, faster, and
            more enjoyable.
          </p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
