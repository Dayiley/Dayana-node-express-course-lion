require("dotenv").config();

const express = require("express");
const path = require("path");

const authRoutes = require("./routes/auth");

const app = express();

// Parse JSON request bodies (needed for POST /api/v1/logon)
app.use(express.json());

// Serve the frontend files from /public
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/v1", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "not found" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
