import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { confirmToast } from "../../utils/confirmToast";
import "../css/AdminMenu.css";

export const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "snacks",
    veg: true,
    image: "",
    prepTime: "10-15 min",
    calories: "300 kcal",
  });

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/menu");
      setMenuItems(response.data.items || []);
      setError("");
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "snacks",
      veg: true,
      image: "",
      prepTime: "10-15 min",
      calories: "300 kcal",
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      veg: item.veg,
      image: item.image,
      prepTime: item.prepTime || "10-15 min",
      calories: item.calories || "300 kcal",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.image
    ) {
      toast.error(
        "Please fill in all required fields (name, description, price, image)",
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
      };

      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, payload);
        toast.success("Item updated successfully!");
      } else {
        await api.post("/menu", payload);
        toast.success("Item added successfully!");
      }

      setShowModal(false);
      fetchMenuItems();
    } catch (err) {
      console.error("Error saving item:", err);
      toast.error(err.response?.data?.error || "Failed to save item");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/menu/${id}`);
      toast.success("Item deleted successfully!");
      fetchMenuItems();
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete item");
    }
  };

  const handleDelete = (id, name) => {
    confirmToast(
      `Are you sure you want to delete "${name}"?`,
      () => deleteItem(id),
      {
        confirmText: "Yes, delete",
        cancelText: "Cancel",
        variant: "danger",
      },
    );
  };

  const handleToggleAvailability = async (id) => {
    try {
      await api.put(`/menu/${id}/toggle`);
      fetchMenuItems();
    } catch (err) {
      console.error("Error toggling availability:", err);
      toast.error("Failed to update availability");
    }
  };

  if (loading) {
    return (
      <div className="admin-menu-page">
        <div className="admin-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading menu items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-menu-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">🍽️ Menu Management</h1>
            <p className="page-subtitle">Manage all your canteen menu items</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddNew}>
            ➕ Add New Item
          </button>
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={fetchMenuItems} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        <div className="menu-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-filters">
            {[
              "all",
              "breakfast",
              "lunch",
              "snacks",
              "beverages",
              "desserts",
            ].map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mini-stats">
          <div className="mini-stat">
            <span className="mini-stat-value">{menuItems.length}</span>
            <span className="mini-stat-label">Total Items</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value">
              {menuItems.filter((i) => i.isAvailable).length}
            </span>
            <span className="mini-stat-label">Available</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value">
              {menuItems.filter((i) => !i.isAvailable).length}
            </span>
            <span className="mini-stat-label">Out of Stock</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value">
              {menuItems.filter((i) => i.veg).length}
            </span>
            <span className="mini-stat-label">Veg Items</span>
          </div>
        </div>

        <div className="table-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="item-cell">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="item-thumb"
                        />
                        <span className="item-name">{item.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{item.category}</span>
                    </td>
                    <td>
                      <span
                        className={`type-tag ${item.veg ? "veg" : "nonveg"}`}
                      >
                        {item.veg ? "🌱 Veg" : "🍖 Non-Veg"}
                      </span>
                    </td>
                    <td className="price-cell">₹{item.price}</td>
                    <td>
                      <button
                        className={`status-toggle ${item.isAvailable ? "available" : "unavailable"}`}
                        onClick={() => handleToggleAvailability(item._id)}
                      >
                        {item.isAvailable ? "✓ Available" : "✕ Out of Stock"}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(item._id, item.name)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredItems.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No items found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Item Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Crispy Veg Burger"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        className="form-input"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="199"
                        required
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        name="category"
                        className="form-input"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="snacks">Snacks</option>
                        <option value="beverages">Beverages</option>
                        <option value="desserts">Desserts</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      className="form-input"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter item description"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Image URL *</label>
                    <input
                      type="url"
                      name="image"
                      className="form-input"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                    {formData.image && (
                      <div className="image-preview">
                        <img
                          src={formData.image}
                          alt="Preview"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Prep Time</label>
                      <input
                        type="text"
                        name="prepTime"
                        className="form-input"
                        value={formData.prepTime}
                        onChange={handleChange}
                        placeholder="10-15 min"
                      />
                    </div>
                    <div className="form-group">
                      <label>Calories</label>
                      <input
                        type="text"
                        name="calories"
                        className="form-input"
                        value={formData.calories}
                        onChange={handleChange}
                        placeholder="300 kcal"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Food Type</label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="veg"
                          checked={formData.veg === true}
                          onChange={() =>
                            setFormData({ ...formData, veg: true })
                          }
                        />
                        🌱 Veg
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="veg"
                          checked={formData.veg === false}
                          onChange={() =>
                            setFormData({ ...formData, veg: false })
                          }
                        />
                        🍖 Non-Veg
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-small"></span>
                        {editingItem ? "Updating..." : "Adding..."}
                      </>
                    ) : editingItem ? (
                      "💾 Update"
                    ) : (
                      "➕ Add Item"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
