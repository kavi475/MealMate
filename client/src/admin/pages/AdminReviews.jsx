import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { confirmToast } from "../../utils/confirmToast";
import "../css/AdminReviews.css";

const Stars = ({ rating }) => (
  <span className="rv-stars">
    {"★".repeat(rating)}
    {"☆".repeat(5 - rating)}
  </span>
);

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/admin/reviews");
      setReviews(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (id) => {
    try {
      await api.delete(`/admin/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete review.");
    }
  };

  const handleDelete = (id) => {
    confirmToast(
      `Are you sure you want to delete this review?`,
      () => deleteReview(id),
      {
        confirmText: "Yes, delete",
        cancelText: "Cancel",
        variant: "danger",
      },
    );
  };

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    const userName = r.userId?.name || r.userName || "";
    const itemName = r.menuItemId?.name || "";
    const matchesSearch =
      userName.toLowerCase().includes(q) ||
      itemName.toLowerCase().includes(q) ||
      (r.comment || "").toLowerCase().includes(q);
    const matchesRating =
      ratingFilter === "all" || r.rating === Number(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : "0.0";

  return (
    <div className="rv-page">
      <h2 className="rv-title">⭐ Customer Reviews</h2>

      <div className="rv-stats">
        <div className="rv-stat">
          <span className="rv-stat-num">{reviews.length}</span>
          <span className="rv-stat-label">Total Reviews</span>
        </div>
        <div className="rv-stat">
          <span className="rv-stat-num">{avgRating}</span>
          <span className="rv-stat-label">Average Rating</span>
        </div>
      </div>

      <div className="rv-filters">
        <input
          type="text"
          className="rv-search"
          placeholder="Search by user, item or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rv-select"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {loading && <p className="rv-msg">Loading reviews...</p>}
      {error && <p className="rv-msg rv-error">⚠️ {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="rv-msg">No reviews found.</p>
      )}

      <div className="rv-list">
        {filtered.map((r) => (
          <div className="rv-card" key={r._id}>
            <div className="rv-card-top">
              <div>
                <div className="rv-item">
                  🍽️ {r.menuItemId?.name || "Deleted item"}
                  {r.menuItemId?.category && (
                    <span className="rv-category">{r.menuItemId.category}</span>
                  )}
                </div>
                <div className="rv-user">
                  by {r.userId?.name || r.userName || "Deleted user"}
                  {r.userId?.email ? ` (${r.userId.email})` : ""}
                </div>
              </div>
              <Stars rating={r.rating} />
            </div>

            <p className="rv-comment">{r.comment}</p>

            <div className="rv-card-bottom">
              <span className="rv-date">
                {new Date(r.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <button
                className="rv-delete-btn"
                onClick={() => handleDelete(r._id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
