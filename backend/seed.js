
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Dell Inspiron 15",
    sku: "LAP-DELL-001",
    description: "15.6-inch laptop with Intel Core i5, 16GB RAM and 512GB SSD",
    quantity: 18,
    costPrice: 52000,
    sellingPrice: 58999,
    lowStockThreshold: 5
  },
  {
    name: "Dell XPS 13",
    sku: "LAP-DELL-002",
    description: "Premium ultrabook with Intel Core Ultra 7 and 16GB RAM",
    quantity: 4,
    costPrice: 105000,
    sellingPrice: 119999,
    lowStockThreshold: 5
  },
  {
    name: "Dell Latitude 5440",
    sku: "LAP-DELL-003",
    description: "Business laptop with Intel Core i5 and 16GB RAM",
    quantity: 12,
    costPrice: 68000,
    sellingPrice: 74999,
    lowStockThreshold: 4
  },
  {
    name: "HP Pavilion 15",
    sku: "LAP-HP-001",
    description: "Everyday laptop with Ryzen 5 and 512GB SSD",
    quantity: 22,
    costPrice: 48000,
    sellingPrice: 54999,
    lowStockThreshold: 5
  },
  {
    name: "HP Victus Gaming 15",
    sku: "LAP-HP-002",
    description: "Gaming laptop with RTX 4050 graphics",
    quantity: 3,
    costPrice: 76000,
    sellingPrice: 84999,
    lowStockThreshold: 5
  },
  {
    name: "HP EliteBook 840",
    sku: "LAP-HP-003",
    description: "Professional business laptop with Intel Core i7",
    quantity: 9,
    costPrice: 92000,
    sellingPrice: 99999,
    lowStockThreshold: 4
  },
  {
    name: "Lenovo IdeaPad Slim 3",
    sku: "LAP-LEN-001",
    description: "Student laptop with Ryzen 5 and 8GB RAM",
    quantity: 30,
    costPrice: 39000,
    sellingPrice: 44999,
    lowStockThreshold: 8
  },
  {
    name: "Lenovo ThinkPad E14",
    sku: "LAP-LEN-002",
    description: "Business laptop with Intel Core i5",
    quantity: 7,
    costPrice: 62000,
    sellingPrice: 69999,
    lowStockThreshold: 5
  },
  {
    name: "Lenovo Legion 5",
    sku: "LAP-LEN-003",
    description: "Gaming laptop with Ryzen 7 and RTX graphics",
    quantity: 6,
    costPrice: 98000,
    sellingPrice: 109999,
    lowStockThreshold: 4
  },
  {
    name: "ASUS VivoBook 15",
    sku: "LAP-ASUS-001",
    description: "Everyday laptop with Intel Core i3",
    quantity: 25,
    costPrice: 35000,
    sellingPrice: 39999,
    lowStockThreshold: 5
  },
  {
    name: "ASUS ZenBook 14",
    sku: "LAP-ASUS-002",
    description: "Lightweight premium laptop with OLED display",
    quantity: 5,
    costPrice: 85000,
    sellingPrice: 94999,
    lowStockThreshold: 5
  },
  {
    name: "ASUS TUF Gaming A15",
    sku: "LAP-ASUS-003",
    description: "Gaming laptop with Ryzen 7 and RTX 4060",
    quantity: 11,
    costPrice: 90000,
    sellingPrice: 99999,
    lowStockThreshold: 4
  },
  {
    name: "Acer Aspire 5",
    sku: "LAP-ACER-001",
    description: "Affordable laptop with Intel Core i5",
    quantity: 16,
    costPrice: 44000,
    sellingPrice: 49999,
    lowStockThreshold: 5
  },
  {
    name: "Acer Nitro V",
    sku: "LAP-ACER-002",
    description: "Gaming laptop with RTX 4050 graphics",
    quantity: 0,
    costPrice: 72000,
    sellingPrice: 79999,
    lowStockThreshold: 4
  },
  {
    name: "Acer Swift Go 14",
    sku: "LAP-ACER-003",
    description: "Portable laptop with OLED display",
    quantity: 8,
    costPrice: 65000,
    sellingPrice: 72999,
    lowStockThreshold: 4
  },
  {
    name: "Apple MacBook Air M2",
    sku: "LAP-APPLE-001",
    description: "13-inch MacBook Air with M2 chip",
    quantity: 14,
    costPrice: 85000,
    sellingPrice: 94900,
    lowStockThreshold: 5
  },
  {
    name: "Apple MacBook Air M3",
    sku: "LAP-APPLE-002",
    description: "13-inch MacBook Air with M3 chip",
    quantity: 2,
    costPrice: 95000,
    sellingPrice: 109900,
    lowStockThreshold: 4
  },
  {
    name: "Apple MacBook Pro 14",
    sku: "LAP-APPLE-003",
    description: "Professional MacBook with M3 Pro chip",
    quantity: 3,
    costPrice: 175000,
    sellingPrice: 199900,
    lowStockThreshold: 3
  },
  {
    name: "MSI Thin 15",
    sku: "LAP-MSI-001",
    description: "Gaming laptop with Intel Core i5 and RTX 4050",
    quantity: 9,
    costPrice: 68000,
    sellingPrice: 74999,
    lowStockThreshold: 4
  },
  {
    name: "MSI Katana 17",
    sku: "LAP-MSI-002",
    description: "Gaming laptop with Intel Core i7",
    quantity: 1,
    costPrice: 105000,
    sellingPrice: 119999,
    lowStockThreshold: 4
  },
  {
    name: "Samsung Galaxy Book4",
    sku: "LAP-SAM-001",
    description: "Thin laptop with Intel Core 5 processor",
    quantity: 13,
    costPrice: 58000,
    sellingPrice: 64999,
    lowStockThreshold: 5
  },
  {
    name: "Samsung Galaxy Book4 Pro",
    sku: "LAP-SAM-002",
    description: "Premium AMOLED laptop with Intel Core Ultra 7",
    quantity: 4,
    costPrice: 110000,
    sellingPrice: 124999,
    lowStockThreshold: 5
  },
  {
    name: "Lenovo V15",
    sku: "LAP-LEN-004",
    description: "Entry-level business laptop",
    quantity: 19,
    costPrice: 32000,
    sellingPrice: 36999,
    lowStockThreshold: 5
  },
  {
    name: "HP Chromebook 14",
    sku: "LAP-HP-004",
    description: "Lightweight Chromebook for basic computing",
    quantity: 0,
    costPrice: 22000,
    sellingPrice: 25999,
    lowStockThreshold: 3
  },
  {
    name: "ASUS ROG Strix G16",
    sku: "LAP-ASUS-004",
    description: "High-performance gaming laptop with RTX graphics",
    quantity: 6,
    costPrice: 135000,
    sellingPrice: 149999,
    lowStockThreshold: 3
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const organizationId = process.env.SEED_ORG_ID;

    if (!organizationId || !mongoose.isValidObjectId(organizationId)) {
      throw new Error("Please provide a valid SEED_ORG_ID in your .env file.");
    }

    let inserted = 0;

    for (const product of products) {
      const result = await Product.updateOne(
        {
          organizationId,
          sku: product.sku
        },
        {
          $set: {
            ...product,
            organizationId
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      }
    }

    console.log("Laptop inventory seed completed.");
    console.log(`Total sample products: ${products.length}`);
    console.log(`New products inserted: ${inserted}`);
    console.log("Existing matching SKUs were updated.");
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
