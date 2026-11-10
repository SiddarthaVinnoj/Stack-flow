import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

app.get("/", (req, res) => {
  res.send("Inventery management is Running!");
});

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/settings", settingsRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found"
  });
});

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();