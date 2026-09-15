import React, { useState } from "react";
import "../css/AdminReports.css";

export const AdminReports = () => {
  const [dateRange, setDateRange] = useState("week");

  const salesData = {
    week: [
      { day: "Mon", orders: 45, revenue: 8900 },
      { day: "Tue", orders: 52, revenue: 10200 },
      { day: "Wed", orders: 38, revenue: 7500 },
      { day: "Thu", orders: 61, revenue: 12300 },
      { day: "Fri", orders: 78, revenue: 15600 },
      { day: "Sat", orders: 92, revenue: 18400 },
      { day: "Sun", orders: 67, revenue: 13400 },
    ],
    month: [
      { day: "Week 1", orders: 320, revenue: 64000 },
      { day: "Week 2", orders: 385, revenue: 77000 },
      { day: "Week 3", orders: 410, revenue: 82000 },
      { day: "Week 4", orders: 445, revenue: 89000 },
    ],
    year: [
      { day: "Q1", orders: 4200, revenue: 840000 },
      { day: "Q2", orders: 5100, revenue: 1020000 },
      { day: "Q3", orders: 4800, revenue: 960000 },
      { day: "Q4", orders: 5600, revenue: 1120000 },
    ],
  };

  const currentData = salesData[dateRange];
  const maxRevenue = Math.max(...currentData.map((d) => d.revenue));

  const categoryData = [
    {
      category: "Snacks",
      orders: 425,
      revenue: "₹48,500",
      percentage: 35,
      color: "#f97316",
    },
    {
      category: "Lunch",
      orders: 380,
      revenue: "₹62,300",
      percentage: 28,
      color: "#3b82f6",
    },
    {
      category: "Breakfast",
      orders: 245,
      revenue: "₹31,605",
      percentage: 18,
      color: "#8b5cf6",
    },
    {
      category: "Beverages",
      orders: 180,
      revenue: "₹16,020",
      percentage: 13,
      color: "#06b6d4",
    },
    {
      category: "Desserts",
      orders: 95,
      revenue: "₹7,505",
      percentage: 6,
      color: "#10b981",
    },
  ];

  const topCustomers = [
    { name: "Sneha Reddy", orders: 32, spent: "₹6,850", avatar: "SR" },
    { name: "Rahul Sharma", orders: 24, spent: "₹5,240", avatar: "RS" },
    { name: "Priya Patel", orders: 18, spent: "₹3,890", avatar: "PP" },
    { name: "Vikram Singh", orders: 12, spent: "₹2,560", avatar: "VS" },
    { name: "Anjali Verma", orders: 8, spent: "₹1,720", avatar: "AV" },
  ];

  return (
    <div className="admin-reports-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">📊 Reports & Analytics</h1>
            <p className="page-subtitle">
              Track your sales performance and insights
            </p>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="date-range-filter">
          <button
            className={`range-btn ${dateRange === "week" ? "active" : ""}`}
            onClick={() => setDateRange("week")}
          >
            This Week
          </button>
          <button
            className={`range-btn ${dateRange === "month" ? "active" : ""}`}
            onClick={() => setDateRange("month")}
          >
            This Month
          </button>
          <button
            className={`range-btn ${dateRange === "year" ? "active" : ""}`}
            onClick={() => setDateRange("year")}
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
                ₹
                {currentData
                  .reduce((s, d) => s + d.revenue, 0)
                  .toLocaleString()}
              </span>
              <span className="rs-label">Total Revenue</span>
            </div>
          </div>
          <div className="report-stat">
            <span className="rs-icon">📦</span>
            <div>
              <span className="rs-value">
                {currentData.reduce((s, d) => s + d.orders, 0).toLocaleString()}
              </span>
              <span className="rs-label">Total Orders</span>
            </div>
          </div>
          <div className="report-stat">
            <span className="rs-icon">📈</span>
            <div>
              <span className="rs-value">
                ₹
                {Math.round(
                  currentData.reduce((s, d) => s + d.revenue, 0) /
                    currentData.reduce((s, d) => s + d.orders, 0),
                )}
              </span>
              <span className="rs-label">Avg. Order Value</span>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📈 Sales Overview</h2>
          </div>
          <div className="chart-container">
            <div className="bar-chart">
              {currentData.map((data, index) => (
                <div key={index} className="bar-item">
                  <div className="bar-wrapper">
                    <div className="bar-value">
                      ₹{(data.revenue / 1000).toFixed(1)}k
                    </div>
                    <div
                      className="bar"
                      style={{
                        height: `${(data.revenue / maxRevenue) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="bar-label">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reports-grid">
          {/* Category Breakdown */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>🍽️ Sales by Category</h2>
            </div>
            <div className="category-list">
              {categoryData.map((cat, index) => (
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
                    <span className="cat-revenue">{cat.revenue}</span>
                    <span className="cat-percent">{cat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>🏆 Top Customers</h2>
            </div>
            <div className="customers-list">
              {topCustomers.map((customer, index) => (
                <div key={index} className="customer-row">
                  <span className="customer-rank">#{index + 1}</span>
                  <div className="customer-avatar-small">{customer.avatar}</div>
                  <div className="customer-info">
                    <span className="customer-name-small">{customer.name}</span>
                    <span className="customer-orders">
                      {customer.orders} orders
                    </span>
                  </div>
                  <span className="customer-spent">{customer.spent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
