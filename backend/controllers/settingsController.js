import Organization from "../models/Organization.js";

// GET SETTINGS
export const getSettings = async (req, res) => {
  try {
    const organization = await Organization.findById(
      req.user.organizationId
    );

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found"
      });
    }

    return res.status(200).json({
      organizationName: organization.name,
      defaultLowStockThreshold:
        organization.defaultLowStockThreshold
    });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch settings"
    });
  }
};

// UPDATE SETTINGS
export const updateSettings = async (req, res) => {
  try {
    const { defaultLowStockThreshold } = req.body;

    if (
      !Number.isInteger(defaultLowStockThreshold) ||
      defaultLowStockThreshold < 0
    ) {
      return res.status(400).json({
        message: "Threshold must be a non-negative integer"
      });
    }

    const organization = await Organization.findByIdAndUpdate(
      req.user.organizationId,
      {
        defaultLowStockThreshold
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found"
      });
    }

    return res.status(200).json({
      message: "Settings updated successfully",
      defaultLowStockThreshold:
        organization.defaultLowStockThreshold
    });

  } catch (error) {
    return res.status(500).json({
      message: "Unable to update settings"
    });
  }
};