import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../css/Menu.css";

export const Menu = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [addingId, setAddingId] = useState(null);

  // Fetch menu items from backend
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/menu");
      setMenuItems(response.data.items || []);
      setError("");
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError("Failed to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter items locally
  useEffect(() => {
    let filtered = [...menuItems];

    if (vegOnly) {
      filtered = filtered.filter((item) => item.veg === true);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchTerm, vegOnly]);

  const categories = [
    { id: "all", label: "All Items", icon: "📋" },
    { id: "breakfast", label: "Breakfast", icon: "🌅" },
    { id: "lunch", label: "Lunch", icon: "🍛" },
    { id: "snacks", label: "Snacks", icon: "🍿" },
    { id: "beverages", label: "Beverages", icon: "🥤" },
    { id: "desserts", label: "Desserts", icon: "🍰" },
  ];

  const handleAddToCart = async (item) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAddingId(item._id);
    const result = await addToCart(item, 1);
    setAddingId(null);

    if (result.success) {
      toast.success(`${item.name} added to cart!`);
    } else {
      toast.error(result.error || "Failed to add item");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setVegOnly(false);
  };

  if (loading) {
    return (
      <main className="menu-page">
        <div className="menu-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading menu...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="menu-page">
        <div className="menu-container">
          <div className="error-state">
            <div className="error-icon">😢</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchMenuItems}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="menu-page">
      <div className="menu-container">
        {/* Header */}
        <section className="menu-header">
          <span className="menu-label">MEALMATE MENU</span>
          <h1 className="page-title">
            Delicious Food, <span> Made Fresh.</span>
          </h1>
          <p className="page-subtitle">
            Discover delicious meals made fresh daily at your campus canteen.
          </p>
        </section>

        {/* Controls */}
        <section className="menu-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search for your favourite food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="cat-icon">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Results header + Veg toggle */}
        <div className="menu-results-header">
          <div>
            <h2>Popular Items</h2>
            <p>
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"} available
            </p>
          </div>

          <label className="veg-toggle">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={() => setVegOnly((v) => !v)}
            />
            <span className="veg-toggle-slider"></span>
            <span className="veg-toggle-label">🟢 Veg Only</span>
          </label>
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article key={item._id} className="menu-card">
                <NavLink to={`/menu/${item._id}`} className="menu-card-link">
                  <div className="menu-card-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="food-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Food";
                      }}
                    />
                    <div
                      className={
                        item.veg ? "food-type veg" : "food-type nonveg"
                      }
                    >
                      <span className="food-type-dot"></span>
                      {item.veg ? "VEG" : "NON-VEG"}
                    </div>
                    <div className="rating-badge">⭐ {item.rating}</div>
                  </div>

                  <div className="menu-card-body">
                    <h3 className="menu-item-name">{item.name}</h3>
                    <p className="menu-item-description">{item.description}</p>
                    <div className="menu-item-meta">
                      <div className="prep-time">
                        <span>⏱</span> {item.prepTime}
                      </div>
                      <div className="menu-item-price">₹{item.price}</div>
                    </div>
                  </div>
                </NavLink>

                <div className="menu-card-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                    disabled={addingId === item._id}
                  >
                    {addingId === item._id ? (
                      <>⏳ Adding...</>
                    ) : (
                      <>
                        <span>+</span> Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No food found</h3>
            <p>We couldn't find anything matching your search.</p>
            <button className="clear-filter-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
