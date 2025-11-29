require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const config = require("./config"); // should export { port, ... }
const { connectDB } = require("./config/db"); // ensure you export connectDB from config/db.js
const factCheckRoutes = require("./routes/factCheck.js");
const authRoutes = require("./routes/auth.js");
const historyRoutes = require("./routes/history.js");
const { errorHandler } = require("./utils/errorHandler.js");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// health
app.get("/", (req, res) => res.json({ status: "API is running" }));

// routes
app.use("/api", factCheckRoutes);
app.use("/auth", authRoutes);
app.use("/history", historyRoutes);

// global error handler (after routes)
app.use(errorHandler);

// start server after DB connects
async function start() {
  try {
    const uri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/factcheckdb";
    await connectDB(uri);
    const port = config.port || process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

// export for tests (optional)
module.exports = app;
