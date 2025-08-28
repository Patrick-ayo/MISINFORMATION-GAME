const axios = require("axios");

/**
 * Call Gemini API with retry logic
 * @param {Object} payload - API payload
 * @param {number} retries - Number of retries
 * @param {number} delay - Initial delay between retries
 * @returns {Promise<Object>} API response
 */
async function callGeminiWithRetry(payload, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        payload,
        {
          headers: {
            "x-goog-api-key": process.env.GEMINI_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      if (err.response?.status === 503 && i < retries - 1) {
        console.warn(`Model overloaded. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      } else {
        throw err;
      }
    }
  }
}

/**
 * Improve text using Gemini API
 * @param {string} text - Text to improve
 * @returns {Promise<string>} Improved text
 */
const improveText = async (text) => {
  try {
    const prompt = `You are a helpful writing assistant. Please improve the following text by:
1. Fixing any grammar or spelling errors
2. Improving clarity and readability
3. Making the tone more professional and engaging
4. Maintaining the original meaning and intent
5. Keeping the length similar to the original

Original text:
"${text}"

Provide ONLY the improved text without any explanations or additional comments.`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const result = await callGeminiWithRetry(payload);
    return result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;
  } catch (error) {
    console.error("Text improvement failed:", error);
    throw new Error("Failed to improve text.");
  }
};

/**
 * Suggest reply using Gemini API
 * @param {string} originalPost - Original post content
 * @param {string[]} previousComments - Array of previous comments
 * @returns {Promise<string>} Suggested reply
 */
const suggestReply = async (originalPost, previousComments = []) => {
  try {
    const prompt = `You are a helpful AI assistant. Please suggest a thoughtful and engaging reply to the following social media post. The reply should be:
1. Relevant to the original post
2. Constructive and positive in tone
3. Encouraging further discussion
4. Natural and conversational
5. Appropriate for social media

Original post:
"${originalPost}"

${
  previousComments.length > 0
    ? `
Previous comments:
${previousComments.map((comment) => `- "${comment}"`).join("\n")}
`
    : ""
}

Provide ONLY the suggested reply without any explanations or additional comments.`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const result = await callGeminiWithRetry(payload);
    return result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch (error) {
    console.error("Reply suggestion failed:", error);
    throw new Error("Failed to suggest reply.");
  }
};

/**
 * Moderate content using Gemini API
 * @param {string} text - Text to moderate
 * @returns {Promise<{isAppropriate: boolean, reason?: string, suggestedRevision?: string}>} Moderation result
 */
const moderateContent = async (text) => {
  try {
    const prompt = `You are a content moderator. Please analyze the following text for appropriateness and provide a JSON response with these fields:
- isAppropriate: boolean indicating if the content is suitable for a professional social platform
- reason: string explaining why the content is inappropriate (if applicable)
- suggestedRevision: string with a revised version that maintains the core message while removing inappropriate content (if applicable)

Text to analyze:
"${text}"

Response format:
{
  "isAppropriate": boolean,
  "reason": string (optional),
  "suggestedRevision": string (optional)
}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const result = await callGeminiWithRetry(payload);
    let responseText =
      result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";

    // Clean markdown code blocks and backticks
    responseText = responseText
      .replace(/```json\n|```/g, "")
      .replace(/`/g, "")
      .trim();

    // Validate JSON
    if (!responseText.startsWith("{") && !responseText.startsWith("[")) {
      throw new Error("Response is not valid JSON");
    }

    const parsedResponse = JSON.parse(responseText);

    // Validate response structure
    if (!parsedResponse.hasOwnProperty("isAppropriate")) {
      throw new Error("Invalid response structure");
    }

    return {
      isAppropriate: parsedResponse.isAppropriate,
      reason: parsedResponse.reason || "",
      suggestedRevision: parsedResponse.suggestedRevision || "",
    };
  } catch (error) {
    console.error("Content moderation failed:", error);
    throw new Error("Content moderation failed. Please try again.");
  }
};

module.exports = {
  callGeminiWithRetry,
  improveText,
  suggestReply,
  moderateContent,
};
