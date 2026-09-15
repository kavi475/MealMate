import React, { useState } from "react";
import "../css/AdminMenu.css";

export const AdminMenu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Crispy Veg Cheese Burger",
      category: "snacks",
      price: 199,
      veg: true,
      available: true,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Paneer Tikka Pizza",
      category: "lunch",
      price: 249,
      veg: true,
      available: true,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Special Masala Dosa",
      category: "breakfast",
      price: 129,
      veg: true,
      available: true,
      image:
        "https://images.unsplash.com/photo-1630384060421-c4e0e5d63e7d?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Chicken Tikka Roll",
      category: "snacks",
      price: 179,
      veg: false,
      available: true,
      image:
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=100&h=100&fit=crop",
    },
    {
      id: 5,
      name: "Cold Coffee",
      category: "beverages",
      price: 89,
      veg: true,
      available: false,
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b880090f?w=100&h=100&fit=crop",
    },
    {
      id: 6,
      name: "Chicken Fried Rice",
      category: "lunch",
      price: 159,
      veg: false,
      available: true,
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=100&h=100&fit=crop",
    },
    {
      id: 7,
      name: "Samosa",
      category: "snacks",
      price: 49,
      veg: true,
      available: true,
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&h=100&fit=crop",
    },
    {
      id: 8,
      name: "Gulab Jamun",
      category: "desserts",
      price: 79,
      veg: true,
      available: true,
      image:
        "https://images.unsplash.com/photo-1589119908998-c0aa86d9b7b4?w=100&h=100&fit=crop",
    },
  ]);

  const categories = [
    "all",
    "breakfast",
    "lunch",
    "snacks",
    "beverages",
    "desserts",
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    }
  };

  const handleToggleAvailability = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item,
      ),
    );
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };
  const handleAddNew = () => {
    setEditingItem(null);
    setShowModal(true);
  };

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
            {categories.map((cat) => (
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
              {menuItems.filter((i) => i.available).length}
            </span>
            <span className="mini-stat-label">Available</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-value">
              {menuItems.filter((i) => !i.available).length}
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
                  <tr key={item.id}>
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
                        className={`status-toggle ${item.available ? "available" : "unavailable"}`}
                        onClick={() => handleToggleAvailability(item.id)}
                      >
                        {item.available ? "✓ Available" : "✕ Out of Stock"}
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
                          onClick={() => handleDelete(item.id)}
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
              <div className="modal-body">
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue={editingItem?.name || ""}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      defaultValue={editingItem?.price || ""}
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-input"
                      defaultValue={editingItem?.category || "snacks"}
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
                  <label>Description</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Enter item description"
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Food Type</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="type"
                        defaultChecked={editingItem?.veg !== false}
                      />{" "}
                      🌱 Veg
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="type"
                        defaultChecked={editingItem?.veg === false}
                      />{" "}
                      🍖 Non-Veg
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  {editingItem ? "💾 Update" : "➕ Add Item"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
