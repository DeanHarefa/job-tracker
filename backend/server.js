// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const authRoutes = require("./routes/authRoutes");
// const applicationRoutes = require("./routes/applicationRoutes");

// const app = express();

// app.use(cors());
// app.use(express.json());

// // ✅ konsisten pakai prefix /api
// app.use("/api/auth", authRoutes);
// app.use("/api/applications", applicationRoutes);

// app.get("/", (_req, res) => {
//   res.send("API is running and MongoDB connected ✅");
// });

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(process.env.PORT, () =>
//       console.log(`Server running on port ${process.env.PORT}`)
//     );
//   })
//   .catch((err) => console.error(err));


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ konsisten pakai prefix /api
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (_req, res) => {
  res.send("API is running and MongoDB connected ✅");
});

// ✅ Cegah multiple connections saat di-host di Vercel
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

// ✅ Koneksi ke MongoDB hanya saat dibutuhkan
connectToDatabase();

// ✅ Jalankan server lokal (saat dijalankan manual)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running locally on port ${PORT}`)
  );
}

// ✅ Export app agar bisa dipakai Vercel
module.exports = app;


