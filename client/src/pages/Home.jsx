import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
  const categories = [
    { name: "Breakfast", icon: "🍳" },
    { name: "Snacks", icon: "🍿" },
    { name: "Fast Food", icon: "🍔" },
    { name: "Main Course", icon: "🍛" },
    { name: "Beverages", icon: "🥤" },
    { name: "Desserts", icon: "🍰" },
  ];

  const popularItems = [
    {
      name: "Crispy Veg Cheese Burger",
      description: "Crunchy veggie patty with double cheddar, fresh lettuce...",
      price: "₹199",
      rating: "⭐ 4.5",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    },
    {
      name: "Paneer Tikka Pizza",
      description: "Spicy marinated paneer cubes, onions, capsicum, and...",
      price: "₹249",
      rating: "⭐ 4.8",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    },
    {
      name: "Special Masala Dosa",
      description:
        "Crispy cone filled with spiced potato curry. Served with...",
      price: "₹129",
      rating: "⭐ 4.7",
      image:
        "https://images.pexels.com/photos/39104603/pexels-photo-39104603.jpeg",
    },
    {
      name: "Chicken Tikka Roll",
      description:
        "Tender pieces of spicy chicken tikka wrapped with onions and...",
      price: "₹179",
      rating: "⭐ 4.6",
      image:
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
    },
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

      {/* WHAT ARE YOU CRAVING TODAY? */}
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

          <div className="popular-grid">
            {popularItems.map((item, index) => (
              <div key={index} className="popular-card">
                <div className="popular-card-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="popular-food-image"
                    loading="lazy"
                  />
                </div>
                <div className="popular-card-body">
                  <h3 className="popular-item-name">{item.name}</h3>
                  <p className="popular-item-description">{item.description}</p>
                  <div className="popular-item-footer">
                    <span className="popular-item-price">{item.price}</span>
                    <span className="popular-item-rating">{item.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/menu" className="btn btn-primary">
              See Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* WHY USE MEALMATE? */}
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
