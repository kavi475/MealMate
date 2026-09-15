import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import "../css/MenuItemDetail.css";

export const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // All Menu Items Data with REAL IMAGES
  const menuItems = [
    {
      id: 1,
      name: "Crispy Veg Cheese Burger",
      description:
        "Crunchy veggie patty with double cheddar cheese, fresh lettuce, tomatoes, and special sauce served with crispy fries.",
      price: 199,
      category: "snacks",
      veg: true,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
      prepTime: "10-15 min",
      calories: "450 kcal",
      isAvailable: true,
      reviews: [
        {
          user: "Rahul",
          rating: 5,
          comment: "Best burger on campus! Highly recommend.",
        },
        {
          user: "Priya",
          rating: 4,
          comment: "Great taste but a bit messy to eat.",
        },
        { user: "Amit", rating: 5, comment: "The cheese pull is amazing!" },
      ],
    },
    {
      id: 2,
      name: "Paneer Tikka Pizza",
      description:
        "Spicy marinated paneer cubes, onions, capsicum, and mozzarella cheese on a crispy thin crust.",
      price: 249,
      category: "lunch",
      veg: true,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
      prepTime: "15-20 min",
      calories: "620 kcal",
      isAvailable: true,
      reviews: [
        { user: "Priya", rating: 5, comment: "Best pizza on campus!" },
        { user: "Amit", rating: 4, comment: "Paneer was well cooked" },
        {
          user: "Sneha",
          rating: 5,
          comment: "Perfect crust and topping ratio!",
        },
      ],
    },
    {
      id: 3,
      name: "Special Masala Dosa",
      description:
        "Crispy cone filled with spiced potato curry. Served with coconut chutney and sambar.",
      price: 129,
      category: "breakfast",
      veg: true,
      rating: 4.7,
      image:
        "https://images.pexels.com/photos/39104603/pexels-photo-39104603.jpeg",
      prepTime: "10-12 min",
      calories: "320 kcal",
      isAvailable: true,
      reviews: [
        { user: "Amit", rating: 5, comment: "Authentic South Indian taste!" },
        { user: "Rahul", rating: 4, comment: "Crispy and delicious" },
      ],
    },
    {
      id: 4,
      name: "Chicken Tikka Roll",
      description:
        "Tender pieces of spicy chicken tikka wrapped with onions, mint chutney in a flaky paratha.",
      price: 179,
      category: "snacks",
      veg: false,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop",
      prepTime: "12-15 min",
      calories: "380 kcal",
      isAvailable: true,
      reviews: [
        { user: "Rahul", rating: 4, comment: "Perfect for a quick bite!" },
        { user: "Priya", rating: 5, comment: "Loved the mint chutney" },
      ],
    },
    {
      id: 5,
      name: "Cold Coffee",
      description:
        "Refreshing cold coffee with ice cream and chocolate syrup. Perfect for a hot day.",
      price: 89,
      category: "beverages",
      veg: true,
      rating: 4.2,
      image:
        "https://images.pexels.com/photos/18142624/pexels-photo-18142624.jpeg",
      prepTime: "5-7 min",
      calories: "180 kcal",
      isAvailable: true,
      reviews: [],
    },
    {
      id: 6,
      name: "Chicken Fried Rice",
      description:
        "Wok-tossed rice with tender chicken, eggs, and fresh vegetables. A meal in itself.",
      price: 159,
      category: "lunch",
      veg: false,
      rating: 4.4,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop",
      prepTime: "12-15 min",
      calories: "420 kcal",
      isAvailable: true,
      reviews: [],
    },
    {
      id: 7,
      name: "Samosa",
      description:
        "Crispy pastry filled with spiced potato and peas. Served with tamarind chutney.",
      price: 49,
      category: "snacks",
      veg: true,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
      prepTime: "5-7 min",
      calories: "150 kcal",
      isAvailable: true,
      reviews: [],
    },
    {
      id: 8,
      name: "Gulab Jamun",
      description:
        "Soft milk dumplings soaked in rose-flavored sugar syrup. The perfect sweet ending.",
      price: 79,
      category: "desserts",
      veg: true,
      rating: 4.9,
      image:
        "https://images.pexels.com/photos/37294501/pexels-photo-37294501.jpeg",
      prepTime: "5-8 min",
      calories: "210 kcal",
      isAvailable: true,
      reviews: [],
    },
  ];

  // Find item by ID
  useEffect(() => {
    const foundItem = menuItems.find((item) => item.id === parseInt(id));
    if (foundItem) {
      setItem(foundItem);
    } else {
      navigate("/menu");
    }
    setLoading(false);
  }, [id, navigate]);

  // Quantity handlers
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add to Cart
  const handleAddToCart = () => {
    alert(`Added ${quantity} × ${item?.name} to cart!`);
    navigate("/cart");
  };

  // Add to Favorites
  const handleAddToFavorites = () => {
    alert(`Added ${item?.name} to favorites!`);
  };

  // Loading State
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

  // Item Not Found
  if (!item) {
    return (
      <div className="item-detail-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">😢</div>
            <h3>Item not found</h3>
            <p>The item you're looking for doesn't exist.</p>
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
        {/* Back Link */}
        <NavLink to="/menu" className="back-link">
          ← Back to Menu
        </NavLink>

        <div className="item-detail-content">
          {/* Image Section with REAL IMAGE */}
          <div className="item-detail-image">
            <img
              src={item.image}
              alt={item.name}
              className="detail-image"
              loading="lazy"
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

          {/* Info Section */}
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

            {/* Price */}
            <div className="item-detail-price">
              <span className="price-label">Price</span>
              <span className="price-value">₹{item.price}</span>
            </div>

            {/* Quantity Selector */}
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

            {/* Actions */}
            <div className="item-detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
              >
                🛒 Add to Cart
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={handleAddToFavorites}
              >
                ❤️ Add to Favorites
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2 className="reviews-title">📝 Customer Reviews</h2>
          {item.reviews && item.reviews.length > 0 ? (
            item.reviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <span className="review-user">{review.user}</span>
                  <span className="review-rating">⭐ {review.rating}/5</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="no-reviews">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
