// test-setup.js - Run this to test your setup
const dotenv = require("dotenv");
dotenv.config();

console.log("🔍 Testing project setup...\n");

// Test 1: Check if required modules can be imported
console.log("📦 Testing module imports:");
try {
  const express = require("express");
  console.log("✅ Express imported successfully");

  const axios = require("axios");
  console.log("✅ Axios imported successfully");

  const cors = require("cors");
  console.log("✅ CORS imported successfully");
} catch (error) {
  console.log("❌ Module import failed:", error.message);
  console.log("💡 Run: npm install express axios cors dotenv");
  process.exit(1);
}

// Test 2: Check environment variables
console.log("\n🔑 Testing environment variables:");
if (process.env.GEMINI_API_KEY) {
  console.log("✅ GEMINI_API_KEY is set");
} else {
  console.log("❌ GEMINI_API_KEY is missing");
  console.log("💡 Add GEMINI_API_KEY to your .env file");
}

if (process.env.SERPER_API_KEY) {
  console.log("✅ SERPER_API_KEY is set");
} else {
  console.log("⚠️  SERPER_API_KEY is missing (optional for enhanced search)");
}

// Test 3: Check if utility files exist and can be imported
console.log("\n📁 Testing utility files:");
try {
  const { analyzeText } = require("./utils/newsAnalyzer");
  console.log("✅ newsAnalyzer imported successfully");

  const {
    improveText,
    suggestReply,
    moderateContent,
  } = require("./utils/geminiHelper");
  console.log("✅ geminiHelper imported successfully");

  const { searchSerper } = require("./utils/serperApi");
  console.log("✅ serperApi imported successfully");
} catch (error) {
  console.log("❌ Utility import failed:", error.message);
  console.log("💡 Make sure all utils files are created in the utils/ folder");
  process.exit(1);
}

// Test 4: Check route file
console.log("\n🛣️  Testing route files:");
try {
  const chatbotRoutes = require("./routes/chatbot");
  console.log("✅ Chatbot routes imported successfully");
  console.log("📝 Route type:", typeof chatbotRoutes);
} catch (error) {
  console.log("❌ Route import failed:", error.message);
  console.log("💡 Make sure routes/chatbot.js exists and exports properly");
  process.exit(1);
}

// Test 5: Quick API test (if GEMINI_API_KEY is available)
if (process.env.GEMINI_API_KEY) {
  console.log("\n🤖 Testing Gemini API connection...");
  const { callGeminiWithRetry } = require("./utils/geminiHelper");

  const testPayload = {
    contents: [
      {
        role: "user",
        parts: [
          { text: "Say 'Hello, API test successful!' if you can read this." },
        ],
      },
    ],
  };

  callGeminiWithRetry(testPayload)
    .then((response) => {
      const reply =
        response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      console.log("✅ Gemini API test successful!");
      console.log("📝 Response:", reply);
      console.log("\n🎉 All tests passed! Your setup is ready!");
    })
    .catch((error) => {
      console.log("❌ Gemini API test failed:", error.message);
      console.log("💡 Check your GEMINI_API_KEY or network connection");
    });
} else {
  console.log("\n🎉 Basic setup tests passed!");
  console.log("💡 Add GEMINI_API_KEY to test API functionality");
}
