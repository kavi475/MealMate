import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { confirmToast } from "../../utils/confirmToast";
import "../css/AdminMessages.css";

const STATUS_ORDER = ["new", "read", "replied", "archived"];

const getAvailableStatuses = (currentStatus) => {
  if (currentStatus === "archived") {
    return ["archived"];
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  if (currentIndex === -1) return STATUS_ORDER;
  return STATUS_ORDER.slice(currentIndex);
};

const isValidTransition = (currentStatus, newStatus) => {
  if (currentStatus === "archived") return false;

  if (currentStatus === newStatus) return false;

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const newIndex = STATUS_ORDER.indexOf(newStatus);

  return newIndex > currentIndex;
};

export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  //  Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact/admin/all");
      setMessages(response.data.messages || []);
      setStats(response.data.stats || {});
      setError("");
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err.response?.data?.error || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  //  Recalculate stats locally
  const recalculateStats = (currentMessages) => {
    const newStats = {
      total: currentMessages.length,
      new: currentMessages.filter((m) => m.status === "new").length,
      read: currentMessages.filter((m) => m.status === "read").length,
      replied: currentMessages.filter((m) => m.status === "replied").length,
      archived: currentMessages.filter((m) => m.status === "archived").length,
    };
    setStats(newStats);
  };

  //  Update status (forward only)
  const handleStatusChange = async (id, newStatus, currentStatus) => {
    if (!id) {
      toast.error("Error: Message ID missing");
      return;
    }

    // Client-side validation
    if (!isValidTransition(currentStatus, newStatus)) {
      toast.error(
        `Cannot change status from "${currentStatus}" to "${newStatus}". Status must follow: new → read → replied → archived. Archived messages are final.`,
        { duration: 5000 },
      );
      return;
    }

    console.log(
      `📝 Changing message ${id} from "${currentStatus}" to "${newStatus}"`,
    );
    setUpdatingId(id);

    try {
      const response = await api.put(`/contact/admin/${id}/status`, {
        status: newStatus,
      });

      console.log("✅ Response:", response.data);

      // Update local state
      setMessages((prev) => {
        const updated = prev.map((msg) =>
          msg._id === id ? { ...msg, status: newStatus } : msg,
        );
        recalculateStats(updated);
        return updated;
      });

      // Update selected message
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err) {
      console.error("❌ Status update failed:", err);
      toast.error(
        `Failed to update status: ${err.response?.data?.error || err.message}`,
      );
    } finally {
      setUpdatingId(null);
    }
  };

  //  Delete message (after confirmation)
  const deleteMessage = async (id) => {
    console.log(`🗑️ Deleting message ${id}`);
    setDeletingId(id);

    try {
      const response = await api.delete(`/contact/admin/${id}`);
      console.log("✅ Deleted:", response.data);

      // Update local state
      setMessages((prev) => {
        const updated = prev.filter((msg) => msg._id !== id);
        recalculateStats(updated);
        return updated;
      });

      // Close modal if it's the deleted message
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }

      toast.success("Message deleted successfully");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast.error(
        `Failed to delete message: ${err.response?.data?.error || err.message}`,
      );
    } finally {
      setDeletingId(null);
    }
  };

  //  Delete message (asks first)
  const handleDelete = (id) => {
    if (!id) {
      toast.error("Error: Message ID missing");
      return;
    }

    confirmToast(
      "Are you sure you want to delete this message?",
      () => deleteMessage(id),
      {
        confirmText: "Yes, delete",
        cancelText: "Cancel",
        variant: "danger",
      },
    );
  };

  //  View message
  const handleViewMessage = (msg) => {
    setSelectedMessage(msg);

    // Auto-mark as read if it's new
    if (msg.status === "new") {
      setTimeout(() => {
        handleStatusChange(msg._id, "read", "new");
      }, 300);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesStatus = filterStatus === "all" || msg.status === filterStatus;
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "#3b82f6",
      read: "#f59e0b",
      replied: "#10b981",
      archived: "#6b7280",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    const icons = {
      new: "🆕",
      read: "👁️",
      replied: "✅",
      archived: "📦",
    };
    return icons[status] || "📬";
  };

  if (loading) {
    return (
      <div className="admin-messages-page">
        <div className="admin-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-messages-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="page-title">📬 Contact Messages</h1>
            <p className="page-subtitle">
              View and manage all messages from the Contact Us page
            </p>
          </div>
          <button className="btn btn-secondary" onClick={fetchMessages}>
            🔄 Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="message-stats">
          <div className="message-stat">
            <span className="ms-value">{stats.total || 0}</span>
            <span className="ms-label">Total</span>
          </div>
          <div className="message-stat new">
            <span className="ms-value">{stats.new || 0}</span>
            <span className="ms-label">New</span>
          </div>
          <div className="message-stat read">
            <span className="ms-value">{stats.read || 0}</span>
            <span className="ms-label">Read</span>
          </div>
          <div className="message-stat replied">
            <span className="ms-value">{stats.replied || 0}</span>
            <span className="ms-label">Replied</span>
          </div>
        </div>

        {/* Search */}
        <div className="message-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="status-filters">
          {["all", "new", "read", "replied", "archived"].map((status) => (
            <button
              key={status}
              className={`filter-btn ${
                filterStatus === status ? "active" : ""
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status !== "all" && getStatusIcon(status)}{" "}
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== "all" && stats[status] > 0 && (
                <span className="filter-count">{stats[status]}</span>
              )}
            </button>
          ))}
        </div>

        {error && <div className="error-banner">{error}</div>}

        {/* Messages Grid */}
        <div className="messages-grid">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className={`message-card ${msg.status}`}
                onClick={() => handleViewMessage(msg)}
              >
                <div className="message-card-header">
                  <div className="message-sender">
                    <div className="sender-avatar">
                      {msg.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="sender-info">
                      <span className="sender-name">{msg.name}</span>
                      <span className="sender-email">{msg.email}</span>
                    </div>
                  </div>
                  <span
                    className="message-status-badge"
                    style={{ backgroundColor: getStatusColor(msg.status) }}
                  >
                    {getStatusIcon(msg.status)} {msg.status}
                    {msg.status === "archived" && " 🔒"}
                  </span>
                </div>

                <div className="message-card-body">
                  <h3 className="message-subject">{msg.subject}</h3>
                  <p className="message-preview">{msg.message}</p>
                </div>

                <div className="message-card-footer">
                  <span className="message-date">
                    📅 {formatDate(msg.createdAt)}
                  </span>
                  <button
                    className="message-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg._id);
                    }}
                    disabled={deletingId === msg._id}
                    title="Delete message"
                  >
                    {deletingId === msg._id ? "⏳" : "🗑️"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No messages found</h3>
              <p>
                {messages.length === 0
                  ? "No one has submitted the contact form yet."
                  : "Try adjusting your search or filter"}
              </p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedMessage && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedMessage(null)}
          >
            <div className="message-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📩 Message Details</h2>
                <button
                  className="modal-close"
                  onClick={() => setSelectedMessage(null)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <div className="detail-avatar">
                    {selectedMessage.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="detail-name">{selectedMessage.name}</h3>
                    <p className="detail-email">{selectedMessage.email}</p>
                  </div>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Subject:</span>
                  <span className="detail-value">
                    {selectedMessage.subject}
                  </span>
                </div>

                <div className="detail-row full">
                  <span className="detail-label">Message:</span>
                  <p className="detail-message">{selectedMessage.message}</p>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Received:</span>
                  <span className="detail-value">
                    {formatDate(selectedMessage.createdAt)}
                  </span>
                </div>

                {/*Status */}
                <div className="detail-row">
                  <span className="detail-label">Status:</span>

                  {selectedMessage.status === "archived" ? (
                    <span
                      className="status-badge-final"
                      style={{
                        backgroundColor: getStatusColor(selectedMessage.status),
                      }}
                    >
                      📦 Archived (Final)
                    </span>
                  ) : (
                    <select
                      className="status-select"
                      value={selectedMessage.status}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedMessage._id,
                          e.target.value,
                          selectedMessage.status,
                        )
                      }
                      disabled={updatingId === selectedMessage._id}
                      style={{
                        color: getStatusColor(selectedMessage.status),
                      }}
                    >
                      {getAvailableStatuses(selectedMessage.status).map(
                        (status) => (
                          <option key={status} value={status}>
                            {status === "new" && "🆕 New"}
                            {status === "read" && "👁️ Read"}
                            {status === "replied" && "✅ Replied"}
                            {status === "archived" && "📦 Archived"}
                          </option>
                        ),
                      )}
                    </select>
                  )}

                  {updatingId === selectedMessage._id && (
                    <span className="updating-text">Updating...</span>
                  )}
                </div>

                {/* Status hint */}
                {selectedMessage.status !== "archived" && (
                  <div className="status-hint">
                    ℹ️ Status can only move forward: new → read → replied →
                    archived
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedMessage._id)}
                  disabled={deletingId === selectedMessage._id}
                >
                  {deletingId === selectedMessage._id
                    ? "⏳ Deleting..."
                    : "🗑️ Delete"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedMessage(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
