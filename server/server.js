require("dotenv").config();

const express = require("express");
const cors = require("cors");
const config = require("./config"); // Automatically loads config/index.js
const factCheckRoutes = require("./routes/factCheck.js");
const { errorHandler } = require("./utils/errorHandler.js");

const app = express();

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

// Main API Routes
app.use("/api", factCheckRoutes);

// Global error handler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});
