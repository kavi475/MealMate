import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import "../css/AdminReports.css";

export const AdminReports = () => {
  const [range, setRange] = useState("week");
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
  });
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllReports = async () => {
    try {
      setLoading(true);

      const [salesRes, catRes, custRes] = await Promise.all([
        api.get(`/admin/reports?range=${range}`),
        api.get("/admin/reports/categories"),
        api.get("/admin/reports/customers"),
      ]);

      setChartData(salesRes.data.chartData || []);
      setSummary(salesRes.data.summary || {});
      setCategories(catRes.data.categories || []);
      setCustomers(custRes.data.customers || []);
      setError("");
    } catch (err) {
      console.error("Reports error:", err);
      setError(err.response?.data?.error || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReports();
  }, [range]);

  const maxRevenue = chartData.length
    ? Math.max(...chartData.map((d) => d.revenue))
    : 0;

  if (loading) {
    return (
      <div className="admin-reports-page">
        <div className="admin-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reports-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="page-title">📊 Reports & Analytics</h1>
            <p className="page-subtitle">
              Track your sales performance and insights
            </p>
          </div>
          <button className="btn btn-secondary" onClick={fetchAllReports}>
            🔄 Refresh
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="date-range-filter">
          <button
            className={`range-btn ${range === "week" ? "active" : ""}`}
            onClick={() => setRange("week")}
          >
            This Week
          </button>
          <button
            className={`range-btn ${range === "month" ? "active" : ""}`}
            onClick={() => setRange("month")}
          >
            This Month
          </button>
          <button
            className={`range-btn ${range === "year" ? "active" : ""}`}
            onClick={() => setRange("year")}
          >
            This Year
          </button>
        </div>

        {/* Summary Stats */}
        <div className="report-stats">
          <div className="report-stat">
            <span className="rs-icon">💰</span>
            <div>
              <span className="rs-value">
                ₹{(summary.totalRevenue || 0).toLocaleString()}
              </span>
              <span className="rs-label">Total Revenue</span>
            </div>
          </div>
          <div className="report-stat">
            <span className="rs-icon">📦</span>
            <div>
              <span className="rs-value">{summary.totalOrders || 0}</span>
              <span className="rs-label">Total Orders</span>
            </div>
          </div>
          <div className="report-stat">
            <span className="rs-icon">📈</span>
            <div>
              <span className="rs-value">₹{summary.avgOrderValue || 0}</span>
              <span className="rs-label">Avg. Order Value</span>
            </div>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {/* Sales Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📈 Sales Overview</h2>
          </div>
          <div className="chart-container">
            {chartData.length > 0 ? (
              <div className="bar-chart">
                {chartData.map((data, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-wrapper">
                      <div className="bar-value">
                        ₹{(data.revenue / 1000).toFixed(1)}k
                      </div>
                      <div
                        className="bar"
                        style={{
                          height: `${
                            maxRevenue > 0
                              ? (data.revenue / maxRevenue) * 100
                              : 0
                          }%`,
                        }}
                        title={`${data.orders} orders`}
                      ></div>
                    </div>
                    <span className="bar-label">{data.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-chart">
                <p>No sales data for this period</p>
              </div>
            )}
          </div>
        </div>

        <div className="reports-grid">
          {/* Category Breakdown */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>🍽️ Sales by Category</h2>
            </div>
            {categories.length > 0 ? (
              <div className="category-list">
                {categories.map((cat, index) => (
                  <div key={index} className="category-row">
                    <div className="cat-info">
                      <span className="cat-name">{cat.category}</span>
                      <span className="cat-orders">{cat.orders} orders</span>
                    </div>
                    <div className="cat-bar-wrapper">
                      <div
                        className="cat-bar"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      ></div>
                    </div>
                    <div className="cat-meta">
                      <span className="cat-revenue">
                        ₹{cat.revenue.toLocaleString()}
                      </span>
                      <span className="cat-percent">{cat.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-chart">
                <p>No category data yet</p>
              </div>
            )}
          </div>

          {/* Top Customers */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>🏆 Top Customers</h2>
            </div>
            {customers.length > 0 ? (
              <div className="customers-list">
                {customers.map((customer, index) => (
                  <div key={index} className="customer-row">
                    <span className="customer-rank">#{index + 1}</span>
                    <div className="customer-avatar-small">
                      {customer.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="customer-info">
                      <span className="customer-name-small">
                        {customer.name}
                      </span>
                      <span className="customer-orders">
                        {customer.totalOrders} orders
                      </span>
                    </div>
                    <span className="customer-spent">
                      ₹{customer.totalSpent.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-chart">
                <p>No customer data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
