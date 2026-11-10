
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockCount: 0,
    lowStockItems: []
  });

  const [defaultThreshold, setDefaultThreshold] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, settingsResponse] = await Promise.all([
        API.get("/dashboard"),
        API.get("/settings")
      ]);

      setDashboard(dashboardResponse.data);

      setDefaultThreshold(
        settingsResponse.data.defaultLowStockThreshold ?? 5
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const lowStockItems = dashboard.lowStockItems || [];

  const getStockStatus = (product) => {
    const threshold =
      product.lowStockThreshold ?? defaultThreshold;

    if (product.quantity === 0) {
      return {
        label: "Out of stock",
        className: "out-stock"
      };
    }

    if (product.quantity <= threshold) {
      return {
        label: "Low stock",
        className: "low-stock"
      };
    }

    return {
      label: "In stock",
      className: "in-stock"
    };
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar title="Dashboard" />

        <div className="page-content dashboard-page">

          {/* PAGE INTRODUCTION */}

          <section className="dashboard-welcome">
            <div>
              <span className="dashboard-eyebrow">
                WORKSPACE OVERVIEW
              </span>

              <h2>Inventory overview</h2>

              <p>
                Monitor your products, track stock levels and stay
                informed about your inventory.
              </p>
            </div>

            <button
              className="dashboard-refresh"
              onClick={fetchDashboard}
              disabled={loading}
            >
              <span className="refresh-symbol">↻</span>
              {loading ? "Refreshing" : "Refresh data"}
            </button>
          </section>

          {error && (
            <div className="dashboard-error">
              <span>{error}</span>
              <button onClick={fetchDashboard}>Try again</button>
            </div>
          )}

          {/* STATISTICS */}

          <section className="dashboard-stats">

            <div className="dashboard-stat-card">
              <div className="stat-card-header">
                <span className="stat-label">TOTAL PRODUCTS</span>
                <span className="stat-index">01</span>
              </div>

              <h3>
                {loading ? "—" : dashboard.totalProducts.toLocaleString("en-IN")}
              </h3>

              <div className="stat-card-footer">
                <span className="stat-indicator"></span>
                <span>Registered products</span>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-card-header">
                <span className="stat-label">TOTAL STOCK</span>
                <span className="stat-index">02</span>
              </div>

              <h3>
                {loading
                  ? "—"
                  : Number(dashboard.totalStock || 0).toLocaleString("en-IN")}
              </h3>

              <div className="stat-card-footer">
                <span className="stat-indicator"></span>
                <span>Available inventory units</span>
              </div>
            </div>

            <div className="dashboard-stat-card low-stock-stat">
              <div className="stat-card-header">
                <span className="stat-label">LOW STOCK ITEMS</span>
                <span className="stat-index">03</span>
              </div>

              <h3>
                {loading ? "—" : dashboard.lowStockCount}
              </h3>

              <div className="stat-card-footer">
                <span className="stat-indicator warning-indicator"></span>
                <span>Require stock attention</span>
              </div>
            </div>

          </section>

          {/* LOW STOCK TABLE */}

          <section className="dashboard-table-card">

            <div className="dashboard-section-heading">
              <div>
                <span className="dashboard-eyebrow">
                  INVENTORY MONITOR
                </span>

                <h4>Low stock products</h4>

                <p>
                  Products that have reached or fallen below their
                  configured stock threshold.
                </p>
              </div>

              <Link
                to="/products"
                className="dashboard-view-link"
              >
                Manage products <span>→</span>
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table dashboard-table align-middle">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>SKU</th>
                    <th>AVAILABLE</th>
                    <th>THRESHOLD</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5">
                        <div className="dashboard-loading">
                          <div className="spinner-border spinner-border-sm"></div>
                          <span>Loading inventory data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : lowStockItems.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="dashboard-empty">
                          <div className="empty-check">✓</div>
                          <h5>No low-stock products</h5>
                          <p>
                            Your inventory is currently within its
                            configured stock levels.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    lowStockItems.map((product) => {
                      const threshold =
                        product.lowStockThreshold ?? defaultThreshold;

                      const status = getStockStatus(product);

                      return (
                        <tr key={product._id}>
                          <td>
                            <strong className="dashboard-product-name">
                              {product.name}
                            </strong>
                          </td>

                          <td>
                            <span className="dashboard-sku">
                              {product.sku}
                            </span>
                          </td>

                          <td>
                            <strong className="quantity-value">
                              {product.quantity}
                            </strong>
                            <span className="quantity-unit"> units</span>
                          </td>

                          <td>
                            <span className="threshold-value">
                              {threshold}
                            </span>
                          </td>

                          <td>
                            <span className={`status-badge ${status.className}`}>
                              <span className="status-dot"></span>
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="dashboard-table-footer">
              <span>
                {loading ? "Loading..." : `${lowStockItems.length} products requiring attention`}
              </span>

              <Link to="/products">View inventory</Link>
            </div>

          </section>

          {/* INFORMATION NOTE */}

          <section className="dashboard-note">
            <div className="dashboard-note-label">INVENTORY GUIDANCE</div>

            <div className="dashboard-note-content">
              <h5>Maintain accurate stock records</h5>
              <p>
                Update product quantities whenever stock changes.
                Products with quantities at or below their threshold
                will automatically appear in this overview.
              </p>
            </div>

            <Link to="/settings" className="dashboard-note-link">
              Stock settings →
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
