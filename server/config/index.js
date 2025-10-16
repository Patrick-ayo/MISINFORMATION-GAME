// require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  aiApiKey: process.env.AI_API_KEY,
  aiApiUrl: process.env.AI_API_URL,
  aiModelName: process.env.AI_MODEL_NAME,
  searchApiKey: process.env.SEARCH_API_KEY,
  searchApiUrl: process.env.SEARCH_API_URL,
};

// Simple validation to ensure essential keys are present
if (!config.aiApiKey || !config.searchApiKey || !config.aiModelName) {
  throw new Error("Missing essential API keys in .env file.");
}

module.exports = config;
