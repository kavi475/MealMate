// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import api from "../utils/api";
// import "../css/Orders.css";

// export const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [error, setError] = useState("");

//   // Fetch orders from backend
//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get("/orders");
//       setOrders(response.data.orders || []);
//       setError("");
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       setError(err.response?.data?.error || "Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusOptions = [
//     { id: "all", label: "All Orders", icon: "📋" },
//     { id: "pending", label: "Pending", icon: "⏳" },
//     { id: "confirmed", label: "Confirmed", icon: "✅" },
//     { id: "preparing", label: "Preparing", icon: "👨‍🍳" },
//     { id: "ready", label: "Ready", icon: "📦" },
//     { id: "delivered", label: "Delivered", icon: "🚚" },
//     { id: "cancelled", label: "Cancelled", icon: "❌" },
//   ];

//   const filteredOrders =
//     filterStatus === "all"
//       ? orders
//       : orders.filter((order) => order.status === filterStatus);

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "#f59e0b",
//       confirmed: "#3b82f6",
//       preparing: "#8b5cf6",
//       ready: "#06b6d4",
//       delivered: "#10b981",
//       cancelled: "#ef4444",
//     };
//     return colors[status] || "#6b7280";
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       pending: "⏳",
//       confirmed: "✅",
//       preparing: "👨‍🍳",
//       ready: "📦",
//       delivered: "🚚",
//       cancelled: "❌",
//     };
//     return icons[status] || "📋";
//   };

//   const getStatusLabel = (status) => {
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="orders-page">
//         <div className="container">
//           <div className="loading-state">
//             <div className="spinner"></div>
//             <p>Loading your orders...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="orders-page">
//       <div className="container">
//         <div className="orders-header">
//           <h1 className="page-title">My Orders</h1>
//           <p className="page-subtitle">
//             Track and manage all your orders in one place
//           </p>
//         </div>

//         {/* Status Filters */}
//         <div className="orders-filters">
//           {statusOptions.map((option) => {
//             const count =
//               option.id === "all"
//                 ? orders.length
//                 : orders.filter((o) => o.status === option.id).length;

//             return (
//               <button
//                 key={option.id}
//                 className={`filter-btn ${filterStatus === option.id ? "active" : ""}`}
//                 onClick={() => setFilterStatus(option.id)}
//               >
//                 <span className="filter-icon">{option.icon}</span>
//                 {option.label}
//                 {option.id !== "all" && count > 0 && (
//                   <span className="filter-count">{count}</span>
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {error && (
//           <div className="error-banner">
//             {error}
//             <button onClick={fetchOrders} className="retry-btn">
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Orders List */}
//         <div className="orders-list">
//           {filteredOrders.length > 0 ? (
//             filteredOrders.map((order) => (
//               <div key={order._id} className="order-card">
//                 <div className="order-card-header">
//                   <div className="order-info">
//                     <span className="order-id">{order.orderId}</span>
//                     <span className="order-date">
//                       📅 {formatDate(order.createdAt)}
//                     </span>
//                   </div>
//                   <div className="order-status">
//                     <span
//                       className="status-badge"
//                       style={{
//                         backgroundColor: getStatusColor(order.status),
//                         color: "white",
//                       }}
//                     >
//                       {getStatusIcon(order.status)}{" "}
//                       {getStatusLabel(order.status)}
//                     </span>
//                     <span className="order-payment">{order.paymentStatus}</span>
//                   </div>
//                 </div>

//                 <div className="order-card-body">
//                   <div className="order-items">
//                     {order.items.map((item, index) => (
//                       <div key={index} className="order-item">
//                         <span className="item-name">{item.name}</span>
//                         <span className="item-details">
//                           {item.quantity} × ₹{item.price}
//                         </span>
//                         <span className="item-total">
//                           ₹{item.quantity * item.price}
//                         </span>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="order-card-footer">
//                     <div className="order-summary">
//                       <span className="delivery-info">
//                         {order.status !== "cancelled" && (
//                           <>🚚 Est. Delivery: {order.estimatedDelivery}</>
//                         )}
//                         {order.status === "cancelled" && (
//                           <>❌ Order Cancelled</>
//                         )}
//                       </span>
//                       <span className="order-total">
//                         Total: <strong>₹{order.total}</strong>
//                       </span>
//                     </div>

//                     <div className="order-actions">
//                       {(order.status === "pending" ||
//                         order.status === "confirmed") && (
//                         <button className="btn btn-danger btn-sm cancel-btn">
//                           Cancel Order
//                         </button>
//                       )}
//                       {order.status === "delivered" && (
//                         <button className="btn btn-secondary btn-sm reorder-btn">
//                           🔄 Reorder
//                         </button>
//                       )}
//                       <NavLink
//                         to={`/order-tracking/${order.orderId}`}
//                         className="btn btn-primary btn-sm track-btn"
//                       >
//                         Track Order →
//                       </NavLink>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="empty-orders">
//               <div className="empty-orders-icon">📦</div>
//               <h3>No orders found</h3>
//               <p>
//                 {filterStatus === "all"
//                   ? "You haven't placed any orders yet."
//                   : `No ${filterStatus} orders found.`}
//               </p>
//               <NavLink to="/menu" className="btn btn-primary">
//                 Browse Menu
//               </NavLink>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import "../css/Orders.css";

export const Orders = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");
  const [reorderingId, setReorderingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data.orders || []);
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (order) => {
    try {
      setReorderingId(order._id);

      // Add each item from the order to the cart
      for (const item of order.items) {
        await addToCart(
          {
            _id: item.menuItemId,
            name: item.name,
            price: item.price,
            image: item.image,
          },
          item.quantity,
        );
      }

      alert(`✅ Added ${order.items.length} item(s) to cart!`);
      navigate("/cart");
    } catch (error) {
      console.error("Reorder failed:", error);
      alert("Failed to reorder. Please try again.");
    } finally {
      setReorderingId(null);
    }
  };

  const statusOptions = [
    { id: "all", label: "All Orders", icon: "📋" },
    { id: "pending", label: "Pending", icon: "⏳" },
    { id: "confirmed", label: "Confirmed", icon: "✅" },
    { id: "preparing", label: "Preparing", icon: "👨‍🍳" },
    { id: "ready", label: "Ready", icon: "📦" },
    { id: "delivered", label: "Delivered", icon: "🚚" },
    { id: "cancelled", label: "Cancelled", icon: "❌" },
  ];

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      confirmed: "#3b82f6",
      preparing: "#8b5cf6",
      ready: "#06b6d4",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      confirmed: "✅",
      preparing: "👨‍🍳",
      ready: "📦",
      delivered: "🚚",
      cancelled: "❌",
    };
    return icons[status] || "📋";
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">
            Track and manage all your orders in one place
          </p>
        </div>

        <div className="orders-filters">
          {statusOptions.map((option) => {
            const count =
              option.id === "all"
                ? orders.length
                : orders.filter((o) => o.status === option.id).length;

            return (
              <button
                key={option.id}
                className={`filter-btn ${
                  filterStatus === option.id ? "active" : ""
                }`}
                onClick={() => setFilterStatus(option.id)}
              >
                <span className="filter-icon">{option.icon}</span>
                {option.label}
                {option.id !== "all" && count > 0 && (
                  <span className="filter-count">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={fetchOrders} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        <div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <span className="order-id">{order.orderId}</span>
                    <span className="order-date">
                      📅 {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(order.status),
                        color: "white",
                      }}
                    >
                      {getStatusIcon(order.status)}{" "}
                      {getStatusLabel(order.status)}
                    </span>
                    <span className="order-payment">{order.paymentStatus}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-details">
                          {item.quantity} × ₹{item.price}
                        </span>
                        <span className="item-total">
                          ₹{item.quantity * item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-summary">
                      <span className="delivery-info">
                        {order.status !== "cancelled" && (
                          <>🚚 Est. Delivery: {order.estimatedDelivery}</>
                        )}
                        {order.status === "cancelled" && (
                          <>❌ Order Cancelled</>
                        )}
                      </span>
                      <span className="order-total">
                        Total: <strong>₹{order.total}</strong>
                      </span>
                    </div>

                    <div className="order-actions">
                      {(order.status === "pending" ||
                        order.status === "confirmed") && (
                        <button className="btn btn-danger btn-sm cancel-btn">
                          Cancel Order
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <button
                          className="btn btn-secondary btn-sm reorder-btn"
                          onClick={() => handleReorder(order)}
                          disabled={reorderingId === order._id}
                        >
                          {reorderingId === order._id
                            ? "⏳ Adding..."
                            : "🔄 Reorder"}
                        </button>
                      )}
                      <NavLink
                        to={`/order-tracking/${order.orderId}`}
                        className="btn btn-primary btn-sm track-btn"
                      >
                        Track Order →
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-orders">
              <div className="empty-orders-icon">📦</div>
              <h3>No orders found</h3>
              <p>
                {filterStatus === "all"
                  ? "You haven't placed any orders yet."
                  : `No ${filterStatus} orders found.`}
              </p>
              <NavLink to="/menu" className="btn btn-primary">
                Browse Menu
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
