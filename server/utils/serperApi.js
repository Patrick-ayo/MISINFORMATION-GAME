const axios = require("axios");

/**
 * Search using Serper API
 * @param {string} query - Search query
 * @returns {Promise<import('./types').SerperOrganicResult[]>} Search results
 */
const searchSerper = async (query) => {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    console.error("Serper API key is not configured.");
    return [];
  }

  try {
    const response = await axios.post(
      "https://google.serper.dev/search",
      {
        q: query,
      },
      {
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Serper API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = response.data;
    return data.organic || [];
  } catch (error) {
    console.error("Error fetching from Serper API:", error.message);
    return [];
  }
};

module.exports = {
  searchSerper,
};
