const axios = require("axios");
const config = require("../config");

exports.fetchSearchResults = async (query) => {
  console.log("  [CLIENT] Preparing to fetch search results...");
  console.log("  [CLIENT] Search URL:", config.searchApiUrl);
  console.log("  [CLIENT] Search API Key:", `"${config.searchApiKey}"`); // Quotes reveal extra spaces

  const options = {
    method: "POST",
    url: config.searchApiUrl,
    headers: {
      "X-API-KEY": config.searchApiKey,
      "Content-Type": "application/json",
    },
    data: { q: query },
  };

  try {
    const response = await axios.request(options);
    console.log("  [CLIENT] Successfully fetched search results.");
    return response.data.organic.slice(0, 5);
  } catch (error) {
    console.error(
      "  [CLIENT] Error fetching search results:",
      error.response?.data || error.message
    );
    throw new Error("Failed to connect to the search API.");
  }
};

exports.fetchAiResponse = async (prompt) => {
  console.log("  [CLIENT] Preparing to fetch AI response...");
  console.log("  [CLIENT] AI URL:", config.aiApiUrl);
  console.log("  [CLIENT] AI API Key:", `"${config.aiApiKey}"`);
  console.log("  [CLIENT] AI Model:", config.aiModelName);

  const options = {
    method: "POST",
    url: config.aiApiUrl,
    headers: {
      Authorization: `Bearer ${config.aiApiKey}`,
      "Content-Type": "application/json",
    },
    data: {
      model: config.aiModelName,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    },
  };

  try {
    const response = await axios.request(options);
    console.log("  [CLIENT] Successfully fetched AI response.");
    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error(
      "  [CLIENT] Error fetching AI response:",
      error.response?.data || error.message
    );
    throw new Error("Failed to connect to the AI API.");
  }
};
