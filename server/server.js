// const express = require("express");
// const dotenv = require("dotenv");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const factCheckRoutes = require("./routes/factCheckRoutes.js");
// const chatbot = require("./routes/chatbot");

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());

// app.use(bodyParser.json());

// app.use(express.static("public"));

// // Chatbot API Route
// app.use("/chatbot", chatbot);

// // Fact Check API Route
// app.use("/fact", factCheckRoutes);

// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const chatbotRoutes = require("./routes/chatbot");

// Use routes
app.use("/api/chatbot", chatbotRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Misinformation Detection API is running!",
    endpoints: [
      "POST /api/chatbot - Simple misinformation detection",
      "POST /api/chatbot/analyze - Detailed text analysis",
      "POST /api/chatbot/improve - Text improvement",
      "POST /api/chatbot/suggest-reply - Reply suggestions",
      "POST /api/chatbot/moderate - Content moderation",
    ],
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    availableRoutes: ["/api/chatbot"],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}`);
  console.log(`🤖 Chatbot API: http://localhost:${PORT}/api/chatbot`);

  // Check if required environment variables are set
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY not found in environment variables");
  } else {
    console.log("✅ GEMINI_API_KEY loaded");
  }

  if (!process.env.SERPER_API_KEY) {
    console.warn("⚠️  SERPER_API_KEY not found (optional for enhanced search)");
  } else {
    console.log("✅ SERPER_API_KEY loaded");
  }
});
