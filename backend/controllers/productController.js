import Product from "../models/Product.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      quantity,
      costPrice,
      sellingPrice,
      lowStockThreshold
    } = req.body;

    if (!name || !sku) {
      return res.status(400).json({
        message: "Product name and SKU are required"
      });
    }

    const product = await Product.create({
      organizationId: req.user.organizationId,
      name,
      sku,
      description,
      quantity: quantity ?? 0,
      costPrice: costPrice ?? null,
      sellingPrice: sellingPrice ?? null,
      lowStockThreshold: lowStockThreshold ?? null
    });

    return res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "SKU already exists in your organization"
      });
    }

    return res.status(400).json({
      message: "Unable to create product",
      error: error.message
    });
  }
};

// GET ALL PRODUCTS + SEARCH
export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = {
      organizationId: req.user.organizationId
    };

    if (search) {
      const safeSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { sku: { $regex: safeSearch, $options: "i" } }
      ];
    }

    const products = await Product.find(filter).sort({
      createdAt: -1
    });

    return res.status(200).json({
      count: products.length,
      products
    });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch products"
    });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({ product });

  } catch (error) {
    return res.status(400).json({
      message: "Invalid product ID"
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "sku",
      "description",
      "quantity",
      "costPrice",
      "sellingPrice",
      "lowStockThreshold"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update"
      });
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        organizationId: req.user.organizationId
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "SKU already exists in your organization"
      });
    }

    return res.status(400).json({
      message: "Unable to update product",
      error: error.message
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    return res.status(400).json({
      message: "Unable to delete product"
    });
  }
};