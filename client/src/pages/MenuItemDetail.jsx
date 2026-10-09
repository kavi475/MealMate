import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import "../css/MenuItemDetail.css";

export const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // Edit review state
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [updatingReview, setUpdatingReview] = useState(false);
  const [editError, setEditError] = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useEffect(() => {
    fetchItem();
    fetchReviews();
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

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const response = await api.get(`/reviews/item/${id}`);
      setReviews(response.data.reviews || []);
      setAverageRating(response.data.averageRating || 0);
      setReviewCount(response.data.count || 0);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewLoading(false);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setAdding(true);
    const result = await addToCart(item, quantity);
    setAdding(false);

    if (result.success) {
      toast.success(`Added ${quantity} × ${item?.name} to cart!`);
      navigate("/cart");
    } else {
      toast.error(result.error || "Failed to add item");
    }
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      navigate("/login");
      return;
    }

    setFavLoading(true);
    const result = await toggleFavorite(item._id);
    setFavLoading(false);

    if (result.success) {
      toast.success(
        result.isFavorite ? "Added to favorites ❤️" : "Removed from favorites",
      );
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");

    if (!isAuthenticated) {
      setReviewError("Please login to submit a review");
      return;
    }

    if (!newRating || newRating < 1 || newRating > 5) {
      setReviewError("Please select a rating between 1 and 5");
      return;
    }

    if (!newComment.trim()) {
      setReviewError("Please write a comment");
      return;
    }

    if (newComment.trim().length < 3) {
      setReviewError("Comment must be at least 3 characters");
      return;
    }

    setSubmittingReview(true);

    try {
      await api.post("/reviews", {
        menuItemId: item._id,
        rating: newRating,
        comment: newComment.trim(),
      });

      setNewRating(5);
      setNewComment("");
      setHoverRating(0);

      await fetchReviews();
      toast.success("Review submitted successfully!");
    } catch (err) {
      setReviewError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Start editing a review
  const handleStartEdit = (review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditError("");
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
    setEditError("");
    setEditHoverRating(0);
  };

  // Save edited review
  const handleUpdateReview = async (reviewId) => {
    setEditError("");

    if (!editRating || editRating < 1 || editRating > 5) {
      setEditError("Please select a rating between 1 and 5");
      return;
    }

    if (!editComment.trim()) {
      setEditError("Please write a comment");
      return;
    }

    if (editComment.trim().length < 3) {
      setEditError("Comment must be at least 3 characters");
      return;
    }

    setUpdatingReview(true);

    try {
      await api.put(`/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment.trim(),
      });

      setEditingReviewId(null);
      setEditRating(5);
      setEditComment("");
      await fetchReviews();
      toast.success("Review updated successfully!");
    } catch (err) {
      setEditError(err.response?.data?.error || "Failed to update review");
    } finally {
      setUpdatingReview(false);
    }
  };

  // Delete review (keeps a confirm because it can't be undone)
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setDeletingReviewId(reviewId);

    try {
      await api.delete(`/reviews/${reviewId}`);
      await fetchReviews();
      toast.success("Review deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete review");
    } finally {
      setDeletingReviewId(null);
    }
  };

  // Check if current user already reviewed
  const userReview = reviews.find(
    (r) => r.userId === user?.id || r.userId === user?._id,
  );
  const hasUserReviewed = !!userReview;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const isOwnReview = (review) => {
    return review.userId === user?.id || review.userId === user?._id;
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
              <span className="item-rating">
                ⭐ {averageRating || item.rating} ({reviewCount})
              </span>
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

        {/* REVIEWS SECTION */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h2 className="reviews-title">📝 Customer Reviews</h2>
            <div className="reviews-summary">
              <span className="summary-rating">⭐ {averageRating}</span>
              <span className="summary-count">
                Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Review Form */}
          {isAuthenticated ? (
            hasUserReviewed ? (
              <div className="already-reviewed">
                ✅ You have already reviewed this item. You can edit or delete
                it below.
              </div>
            ) : (
              <form className="review-form" onSubmit={handleSubmitReview}>
                <h3 className="review-form-title">Write a Review</h3>

                {reviewError && (
                  <div className="error-message">{reviewError}</div>
                )}

                <div className="review-form-group">
                  <label className="form-label">Your Rating *</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${
                          star <= (hoverRating || newRating) ? "active" : ""
                        }`}
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        ★
                      </button>
                    ))}
                    <span className="rating-text">
                      {newRating} / 5 ({renderStars(newRating)})
                    </span>
                  </div>
                </div>

                <div className="review-form-group">
                  <label className="form-label">Your Review *</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Share your experience with this item..."
                    value={newComment}
                    onChange={(e) => {
                      setNewComment(e.target.value);
                      setReviewError("");
                    }}
                    maxLength={500}
                  />
                  <div className="char-counter">{newComment.length} / 500</div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingReview}
                >
                  {submittingReview ? (
                    <>
                      <span className="spinner-small"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            )
          ) : (
            <div className="login-to-review">
              <p>Please login to write a review</p>
              <NavLink to="/login" className="btn btn-primary">
                Login
              </NavLink>
            </div>
          )}

          {/* Reviews List */}
          <div className="reviews-list">
            {reviewLoading ? (
              <div className="reviews-loading">
                <div className="spinner-small"></div>
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => {
                const isOwn = isOwnReview(review);
                const isEditing = editingReviewId === review._id;

                return (
                  <div
                    key={review._id}
                    className={`review-item ${isOwn ? "own-review" : ""}`}
                  >
                    {isEditing ? (
                      /* EDIT MODE */
                      <div className="review-edit-form">
                        <div className="review-edit-header">
                          <h4>Edit Your Review</h4>
                        </div>

                        {editError && (
                          <div className="error-message">{editError}</div>
                        )}

                        <div className="review-form-group">
                          <label className="form-label">Rating</label>
                          <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={`star-btn ${
                                  star <= (editHoverRating || editRating)
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => setEditRating(star)}
                                onMouseEnter={() => setEditHoverRating(star)}
                                onMouseLeave={() => setEditHoverRating(0)}
                              >
                                ★
                              </button>
                            ))}
                            <span className="rating-text">
                              {editRating} / 5
                            </span>
                          </div>
                        </div>

                        <div className="review-form-group">
                          <label className="form-label">Comment</label>
                          <textarea
                            className="form-textarea"
                            rows="3"
                            value={editComment}
                            onChange={(e) => {
                              setEditComment(e.target.value);
                              setEditError("");
                            }}
                            maxLength={500}
                          />
                          <div className="char-counter">
                            {editComment.length} / 500
                          </div>
                        </div>

                        <div className="review-edit-actions">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleUpdateReview(review._id)}
                            disabled={updatingReview}
                          >
                            {updatingReview ? (
                              <>
                                <span className="spinner-small"></span>
                                Saving...
                              </>
                            ) : (
                              "💾 Save"
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={handleCancelEdit}
                            disabled={updatingReview}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* DISPLAY MODE */
                      <>
                        <div className="review-header">
                          <div className="review-user-info">
                            <div className="review-avatar">
                              {review.userName?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <span className="review-user">
                                {review.userName}
                                {isOwn && (
                                  <span className="you-badge"> (You)</span>
                                )}
                              </span>
                              <span className="review-date">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                          <span className="review-rating">
                            {renderStars(review.rating)} {review.rating}/5
                          </span>
                        </div>
                        <p className="review-comment">{review.comment}</p>

                        {isOwn && (
                          <div className="review-actions">
                            <button
                              className="review-action-btn edit"
                              onClick={() => handleStartEdit(review)}
                              title="Edit review"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="review-action-btn delete"
                              onClick={() => handleDeleteReview(review._id)}
                              disabled={deletingReviewId === review._id}
                              title="Delete review"
                            >
                              {deletingReviewId === review._id
                                ? "⏳ Deleting..."
                                : "🗑️ Delete"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-reviews">
                <div className="no-reviews-icon">💬</div>
                <h3>No reviews yet</h3>
                <p>Be the first to review this item!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
