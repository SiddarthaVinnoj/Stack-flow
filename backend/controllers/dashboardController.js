import Product from "../models/Product.js";
import Organization from "../models/Organization.js";

export const getDashboard = async (req, res) => {
  try {
    const organization = await Organization.findById(
      req.user.organizationId
    );

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found"
      });
    }

    const products = await Product.find({
      organizationId: req.user.organizationId
    });

    const totalProducts = products.length;

    const totalStock = products.reduce(
      (total, product) => total + product.quantity,
      0
    );

    const lowStockItems = products.filter((product) => {
      const threshold =
        product.lowStockThreshold ??
        organization.defaultLowStockThreshold;

      return product.quantity <= threshold;
    });

    return res.status(200).json({
      totalProducts,
      totalStock,
      lowStockCount: lowStockItems.length,
      lowStockItems
    });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to load dashboard"
    });
  }
};