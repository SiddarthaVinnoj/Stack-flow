
import { useEffect, useState } from "react";

import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [defaultThreshold, setDefaultThreshold] = useState(5);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch products
  const fetchProducts = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        `/products?search=${encodeURIComponent(searchValue)}`
      );

      setProducts(
        Array.isArray(response.data)
          ? response.data
          : response.data.products || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch organization settings
  const fetchSettings = async () => {
    try {
      const response = await API.get("/settings");

      setDefaultThreshold(
        response.data.defaultLowStockThreshold ?? 5
      );
    } catch (err) {
      console.log("Settings error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  // Search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  // Add product
  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Close form
  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setError("");
  };

  // Save product
  const handleSave = async (productData) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingProduct) {
        await API.put(
          `/products/${editingProduct._id}`,
          productData
        );

        setSuccess("Product updated successfully.");
      } else {
        await API.post("/products", productData);

        setSuccess("Product added successfully.");
      }

      setShowForm(false);
      setEditingProduct(null);

      await fetchProducts(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      await API.delete(`/products/${id}`);

      setSuccess("Product deleted successfully.");

      await fetchProducts(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete product."
      );
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") {
      return "-";
    }

    return `₹${Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Get stock status
  const getStockStatus = (product, threshold) => {
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
        <Navbar title="Products" />

        <div className="page-content products-page">

          {/* PAGE HEADING */}

          <section className="products-page-heading">
            <div>
              <span className="products-eyebrow">
                INVENTORY MANAGEMENT
              </span>

              <h2>Products</h2>

              <p>
                Manage your inventory items, quantities and pricing.
              </p>
            </div>

            {!showForm && (
              <button
                className="add-product-btn"
                onClick={handleAdd}
              >
                <span>+</span>
                Add product
              </button>
            )}
          </section>

          {/* ALERT MESSAGES */}

          {error && (
            <div className="products-alert products-error">
              <span>{error}</span>
              <button onClick={() => setError("")}>Dismiss</button>
            </div>
          )}

          {success && (
            <div className="products-alert products-success">
              <span>{success}</span>
              <button onClick={() => setSuccess("")}>Dismiss</button>
            </div>
          )}

          {/* ADD / EDIT PRODUCT FORM */}

          {showForm && (
            <section className="product-form-card">

              <div className="product-form-heading">
                <div>
                  <span className="products-eyebrow">
                    PRODUCT DETAILS
                  </span>

                  <h4>
                    {editingProduct ? "Edit product" : "Add new product"}
                  </h4>

                  <p>
                    {editingProduct
                      ? "Update the information for this inventory item."
                      : "Enter the details of the product you want to add."}
                  </p>
                </div>

                <button
                  type="button"
                  className="form-close-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Close
                </button>
              </div>

              <ProductForm
                initialData={editingProduct}
                onSubmit={handleSave}
                onCancel={handleCancel}
                loading={saving}
              />

            </section>
          )}

          {/* PRODUCT LIST */}

          {!showForm && (
            <section className="products-list-card">

              <div className="products-toolbar">
                <div>
                  <h4>All products</h4>
                  <p>
                    Your complete inventory catalogue.
                  </p>
                </div>

                <form
                  className="product-search"
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    placeholder="Search by product name or SKU"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <button type="submit" disabled={loading}>
                    Search
                  </button>
                </form>
              </div>

              {/* TABLE */}

              <div className="table-responsive">
                <table className="table product-table align-middle">

                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>SKU</th>
                      <th>QUANTITY</th>
                      <th>COST PRICE</th>
                      <th>SELLING PRICE</th>
                      <th>THRESHOLD</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>

                    {loading ? (
                      <tr>
                        <td colSpan="8">
                          <div className="products-loading">
                            <div className="spinner-border spinner-border-sm"></div>
                            <span>Loading products...</span>
                          </div>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan="8">
                          <div className="empty-products">
                            <div className="empty-products-mark">—</div>

                            <h5>
                              {search
                                ? "No matching products"
                                : "No products added yet"}
                            </h5>

                            <p>
                              {search
                                ? "Try another product name or SKU."
                                : "Add your first product to start managing your inventory."}
                            </p>

                            {!search && (
                              <button onClick={handleAdd}>
                                Add your first product
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => {
                        const threshold =
                          product.lowStockThreshold ?? defaultThreshold;

                        const status = getStockStatus(product, threshold);

                        return (
                          <tr key={product._id}>

                            <td>
                              <div className="product-name-cell">
                                <strong>{product.name}</strong>

                                {product.description && (
                                  <small>{product.description}</small>
                                )}
                              </div>
                            </td>

                            <td>
                              <span className="sku-text">
                                {product.sku}
                              </span>
                            </td>

                            <td>
                              <strong className="product-quantity">
                                {Number(product.quantity).toLocaleString("en-IN")}
                              </strong>
                              <span className="product-unit"> units</span>
                            </td>

                            <td>
                              <span className="product-price">
                                {formatPrice(product.costPrice)}
                              </span>
                            </td>

                            <td>
                              <span className="product-price">
                                {formatPrice(product.sellingPrice)}
                              </span>
                            </td>

                            <td>
                              <span className="product-threshold">
                                {threshold}
                              </span>
                            </td>

                            <td>
                              <span className={`product-status ${status.className}`}>
                                <span className="product-status-dot"></span>
                                {status.label}
                              </span>
                            </td>

                            <td>
                              <div className="product-actions">

                                <button
                                  className="product-edit-btn"
                                  onClick={() => handleEdit(product)}
                                >
                                  Edit
                                </button>

                                <button
                                  className="product-delete-btn"
                                  onClick={() => handleDelete(product._id)}
                                >
                                  Delete
                                </button>

                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}

                  </tbody>
                </table>
              </div>

              {/* TABLE FOOTER */}

              <div className="products-footer">
                <span>
                  {loading
                    ? "Loading products..."
                    : `Showing ${products.length} product(s)`}
                </span>

                <span>StockFlow Inventory</span>
              </div>

            </section>
          )}

        </div>
      </main>
    </div>
  );
};

export default Products;
