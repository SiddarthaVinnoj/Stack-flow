
import { useEffect, useState } from "react";

import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


const Settings = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [threshold, setThreshold] = useState(5);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch organization settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/settings");

      setOrganizationName(
        response.data.organizationName || ""
      );

      setThreshold(
        response.data.defaultLowStockThreshold ?? 5
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load settings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update organization settings
  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const numericThreshold = Number(threshold);

    if (
      threshold === "" ||
      !Number.isInteger(numericThreshold) ||
      numericThreshold < 0
    ) {
      setError("Please enter a valid non-negative whole number.");
      return;
    }

    try {
      setSaving(true);

      const response = await API.put("/settings", {
        defaultLowStockThreshold: numericThreshold
      });

      setThreshold(
        response.data.defaultLowStockThreshold ?? numericThreshold
      );

      setSuccess("Settings updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar title="Settings" />

        <div className="page-content settings-page">

          {/* PAGE HEADING */}

          <section className="settings-page-heading">
            <div>
              <span className="settings-eyebrow">
                WORKSPACE CONFIGURATION
              </span>

              <h2>Settings</h2>

              <p>
                Manage your organization details and inventory preferences.
              </p>
            </div>
          </section>

          {/* ALERT MESSAGES */}

          {error && (
            <div className="settings-alert settings-error">
              <span>{error}</span>

              <button onClick={() => setError("")}>
                Dismiss
              </button>
            </div>
          )}

          {success && (
            <div className="settings-alert settings-success">
              <span>{success}</span>

              <button onClick={() => setSuccess("")}>
                Dismiss
              </button>
            </div>
          )}

          {loading ? (
            <div className="settings-loading">
              <div className="spinner-border spinner-border-sm"></div>
              <span>Loading organization settings...</span>
            </div>
          ) : (
            <div className="settings-content">

              {/* ORGANIZATION INFORMATION */}

              <section className="settings-card">

                <div className="settings-card-heading">
                  <div>
                    <span className="settings-section-number">
                      01
                    </span>

                    <h4>Organization information</h4>

                    <p>
                      Details associated with your StockFlow workspace.
                    </p>
                  </div>
                </div>

                <div className="settings-field">
                  <label>Organization name</label>

                  <input
                    type="text"
                    className="settings-input"
                    value={organizationName}
                    readOnly
                  />

                  <small>
                    Your organization name is currently read-only.
                  </small>
                </div>

              </section>

              {/* INVENTORY SETTINGS */}

              <section className="settings-card">

                <div className="settings-card-heading">
                  <div>
                    <span className="settings-section-number">
                      02
                    </span>

                    <h4>Inventory preferences</h4>

                    <p>
                      Configure how StockFlow identifies low-stock products.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSave}>

                  <div className="settings-field">
                    <label htmlFor="default-threshold">
                      Default low-stock threshold
                    </label>

                    <div className="threshold-input-wrapper">
                      <input
                        id="default-threshold"
                        type="number"
                        className="settings-input"
                        min="0"
                        step="1"
                        value={threshold}
                        onChange={(e) => {
                          setThreshold(e.target.value);
                          setSuccess("");
                        }}
                        required
                      />

                      <span>Units</span>
                    </div>

                    <small>
                      Products with quantities at or below this value
                      will be marked as low stock.
                    </small>
                  </div>

                  <div className="settings-info">
                    <div className="settings-info-mark">i</div>

                    <p>
                      This is the default threshold for all products.
                      If an individual product has its own threshold,
                      that product-specific value will take priority.
                    </p>
                  </div>

                  <div className="settings-actions">
                    <button
                      type="submit"
                      className="settings-save-btn"
                      disabled={saving}
                    >
                      {saving ? "Saving changes..." : "Save changes"}
                    </button>
                  </div>

                </form>

              </section>

              {/* APPLICATION INFORMATION */}

              <section className="settings-footer-card">
                <div>
                  <h5>StockFlow</h5>
                  <p>Inventory management workspace</p>
                </div>

                <span>VERSION 1.0.0</span>
              </section>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Settings;
