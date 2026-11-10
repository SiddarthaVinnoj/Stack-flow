import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    description: {
      type: String,
      default: ""
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer"
      }
    },

    costPrice: {
      type: Number,
      default: null,
      min: 0
    },

    sellingPrice: {
      type: Number,
      default: null,
      min: 0
    },

    lowStockThreshold: {
      type: Number,
      default: null,
      min: 0,
      validate: {
        validator: (value) =>
          value === null || Number.isInteger(value),
        message: "Low stock threshold must be an integer"
      }
    }
  },
  {
    timestamps: true
  }
);

productSchema.index(
  { organizationId: 1, sku: 1 },
  { unique: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;