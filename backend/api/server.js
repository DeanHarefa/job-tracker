const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const serverless = require("serverless-http");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ===== ROUTES =====
const applicationRoutes = require("../routes/applicationRoutes");
const authRoutes = require("../routes/authRoutes");

app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);

// ===== ROOT TEST =====
app.get("/api", (req, res) => {
  res.json({ message: "✅ Backend is running correctly!" });
});

// ===== CONNECT DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ===== EXPORT FOR VERCEL =====
module.exports = serverless(app);

// ===== LOCAL DEV MODE =====
if (process.env.LOCAL_DEV === "true") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
}
