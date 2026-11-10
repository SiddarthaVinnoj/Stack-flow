
import { useEffect, useState } from "react";


const ProductForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    quantity: 0,
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        sku: initialData.sku || "",
        description: initialData.description || "",
        quantity: initialData.quantity ?? 0,
        costPrice: initialData.costPrice ?? "",
        sellingPrice: initialData.sellingPrice ?? "",
        lowStockThreshold: initialData.lowStockThreshold ?? ""
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      quantity: Number(formData.quantity),
      costPrice:
        formData.costPrice === ""
          ? null
          : Number(formData.costPrice),
      sellingPrice:
        formData.sellingPrice === ""
          ? null
          : Number(formData.sellingPrice),
      lowStockThreshold:
        formData.lowStockThreshold === ""
          ? null
          : Number(formData.lowStockThreshold)
    };

    onSubmit(productData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>

      <div className="product-form-section">
        <div className="product-form-section-heading">
          <h4>Product information</h4>
          <p>Basic details used to identify your product.</p>
        </div>

        <div className="row">

          <div className="col-md-6 product-form-field">
            <label htmlFor="product-name">Product name <span>*</span></label>
            <input
              id="product-name"
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 product-form-field">
            <label htmlFor="product-sku">SKU <span>*</span></label>
            <input
              id="product-sku"
              type="text"
              name="sku"
              className="form-control"
              placeholder="Example: IP16-001"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 product-form-field">
            <label htmlFor="product-description">Description</label>
            <textarea
              id="product-description"
              name="description"
              className="form-control"
              rows="3"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

        </div>
      </div>

      <div className="product-form-section">
        <div className="product-form-section-heading">
          <h4>Stock information</h4>
          <p>Set the available quantity and stock alert level.</p>
        </div>

        <div className="row">

          <div className="col-md-6 product-form-field">
            <label htmlFor="product-quantity">Available quantity <span>*</span></label>
            <input
              id="product-quantity"
              type="number"
              name="quantity"
              className="form-control"
              min="0"
              step="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 product-form-field">
            <label htmlFor="product-threshold">Low stock threshold</label>
            <input
              id="product-threshold"
              type="number"
              name="lowStockThreshold"
              className="form-control"
              placeholder="Organization default"
              min="0"
              step="1"
              value={formData.lowStockThreshold}
              onChange={handleChange}
            />
            <small>Leave empty to use organization default.</small>
          </div>

        </div>
      </div>

      <div className="product-form-section">
        <div className="product-form-section-heading">
          <h4>Pricing information</h4>
          <p>Pricing details are optional.</p>
        </div>

        <div className="row">

          <div className="col-md-6 product-form-field">
            <label htmlFor="product-cost">Cost price</label>
            <input
              id="product-cost"
              type="number"
              name="costPrice"
              className="form-control"
              placeholder="Enter cost price"
              min="0"
              step="0.01"
              value={formData.costPrice}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 product-form-field">
            <label htmlFor="product-selling">Selling price</label>
            <input
              id="product-selling"
              type="number"
              name="sellingPrice"
              className="form-control"
              placeholder="Enter selling price"
              min="0"
              step="0.01"
              value={formData.sellingPrice}
              onChange={handleChange}
            />
          </div>

        </div>
      </div>

      <div className="product-form-actions">

        <button
          type="button"
          className="product-cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="product-save-btn"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Product"
              : "Add Product"}
        </button>

      </div>

    </form>
  );
};

export default ProductForm;
