import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/Menu.css";

export const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Menu items with REAL IMAGE URLs
  const menuItems = [
    {
      id: 1,
      name: "Crispy Veg Cheese Burger",
      description:
        "Crunchy veggie patty with double cheddar, fresh lettuce and special sauce.",
      price: 199,
      category: "snacks",
      veg: true,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      prepTime: "10-15 min",
    },
    {
      id: 2,
      name: "Paneer Tikka Pizza",
      description:
        "Spicy marinated paneer cubes, onions, capsicum and melted cheese.",
      price: 249,
      category: "lunch",
      veg: true,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      prepTime: "15-20 min",
    },
    {
      id: 3,
      name: "Special Masala Dosa",
      description:
        "Crispy dosa filled with delicious spiced potato curry and served with chutney.",
      price: 129,
      category: "breakfast",
      veg: true,
      rating: 4.7,
      image:
        "https://images.pexels.com/photos/39104603/pexels-photo-39104603.jpeg",
      prepTime: "10-12 min",
    },
    {
      id: 4,
      name: "Chicken Tikka Roll",
      description:
        "Tender pieces of spicy chicken tikka wrapped with onions and fresh vegetables.",
      price: 179,
      category: "snacks",
      veg: false,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
      prepTime: "12-15 min",
    },
    {
      id: 5,
      name: "Cold Coffee",
      description:
        "Refreshing cold coffee blended with ice cream and delicious chocolate syrup.",
      price: 89,
      category: "beverages",
      veg: true,
      rating: 4.2,
      image:
        "https://images.pexels.com/photos/18142624/pexels-photo-18142624.jpeg",
      prepTime: "5-7 min",
    },
    {
      id: 6,
      name: "Chicken Fried Rice",
      description:
        "Wok-tossed rice with tender chicken, eggs and fresh vegetables.",
      price: 159,
      category: "lunch",
      veg: false,
      rating: 4.4,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      prepTime: "12-15 min",
    },
    {
      id: 7,
      name: "Samosa",
      description:
        "Crispy pastry filled with spiced potato and peas, served hot and fresh.",
      price: 49,
      category: "snacks",
      veg: true,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
      prepTime: "5-7 min",
    },
    {
      id: 8,
      name: "Gulab Jamun",
      description:
        "Soft milk dumplings soaked in delicious rose-flavored sugar syrup.",
      price: 79,
      category: "desserts",
      veg: true,
      rating: 4.9,
      image:
        "https://images.pexels.com/photos/37294501/pexels-photo-37294501.jpeg",
      prepTime: "5-8 min",
    },
  ];

  const categories = [
    { id: "all", label: "All Items", icon: "📋" },
    { id: "breakfast", label: "Breakfast", icon: "🌅" },
    { id: "lunch", label: "Lunch", icon: "🍛" },
    { id: "snacks", label: "Snacks", icon: "🍿" },
    { id: "beverages", label: "Beverages", icon: "🥤" },
    { id: "desserts", label: "Desserts", icon: "🍰" },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    alert(`${item.name} added to cart!`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

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
                className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="cat-icon">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Results */}
        <div className="menu-results-header">
          <div>
            <h2>Popular Items</h2>
            <p>
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"} available
            </p>
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article key={item.id} className="menu-card">
                <NavLink to={`/menu/${item.id}`} className="menu-card-link">
                  <div className="menu-card-image">
                    {/* ✅ REAL IMAGE */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="food-image"
                      loading="lazy"
                    />
                    {/* Veg / Non Veg Badge */}
                    <div
                      className={
                        item.veg ? "food-type veg" : "food-type nonveg"
                      }
                    >
                      <span className="food-type-dot"></span>
                      {item.veg ? "VEG" : "NON-VEG"}
                    </div>
                    {/* Rating Badge */}
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
                  >
                    <span>+</span> Add to Cart
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
