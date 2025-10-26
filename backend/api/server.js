const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") }); // ✅ pakai path absolut agar aman di semua lingkungan

const authRoutes = require("../routes/authRoutes");
const applicationRoutes = require("../routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ prefix API routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// ✅ test endpoint
app.get("/", (_req, res) => {
  res.send("API is running and MongoDB connected ✅");
});

// ✅ Hindari multiple DB connection (khusus untuk Vercel)
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = !!db.connections[0].readyState;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
}
connectToDatabase();

// ✅ Jalankan server lokal
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`✅ Local server running on port ${PORT}`));
}

// ✅ Export untuk Vercel
module.exports = app;
