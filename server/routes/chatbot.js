// // // server/routes/chatbot.js
// // const express = require("express");
// // const dotenv = require("dotenv");
// // const axios = require("axios");

// // dotenv.config();

// // const router = express.Router();

// // async function callGeminiWithRetry(payload, retries = 3, delay = 2000) {
// //   for (let i = 0; i < retries; i++) {
// //     try {
// //       const response = await axios.post(
// //         "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
// //         payload,
// //         {
// //           headers: {
// //             "x-goog-api-key": process.env.GEMINI_API_KEY,
// //             "Content-Type": "application/json",
// //           },
// //         }
// //       );
// //       return response.data;
// //     } catch (err) {
// //       if (err.response?.status === 503 && i < retries - 1) {
// //         console.warn(`Model overloaded. Retrying in ${delay}ms...`);
// //         await new Promise((resolve) => setTimeout(resolve, delay));
// //         delay *= 2; // exponential backoff
// //       } else {
// //         throw err;
// //       }
// //     }
// //   }
// // }

// // router.post("/", async (req, res) => {
// //   const { message } = req.body;

// //   if (!message) {
// //     return res.status(400).json({ error: "Message is required" });
// //   }

// //   try {
// //     const payload = {
// //       contents: [
// //         {
// //           role: "user",
// //           parts: [{ text: message }],
// //         },
// //       ],
// //       systemInstruction: {
// //         role: "system",
// //         parts: [
// //           { text: "You are Glitchy, a chatbot that detects misinformation." },
// //         ],
// //       },
// //     };

// //     const data = await callGeminiWithRetry(payload);

// //     const reply =
// //       data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply generated.";
// //     res.json({ reply });
// //   } catch (err) {
// //     console.error("Chatbot API Error:", err.response?.data || err.message);
// //     res.status(500).json({ error: "Something went wrong" });
// //   }
// // });

// // module.exports = router;

// const express = require("express");
// const dotenv = require("dotenv");
// const { analyzeText } = require("../utils/newsAnalyzer");
// const {
//   improveText,
//   suggestReply,
//   moderateContent,
// } = require("../utils/geminiHelper");

// dotenv.config();

// const router = express.Router();

// // Original chatbot endpoint for simple misinformation detection
// router.post("/", async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });

//     module.exports = router;
//   }

//   try {
//     // Use the enhanced analysis function
//     const analysisResult = await analyzeText(message);

//     // Format response for chatbot-style interaction
//     let reply = `Analysis Complete!\n\n`;
//     reply += `Credibility Score: ${analysisResult.credibilityScore}/100\n`;
//     reply += `Factual: ${
//       analysisResult.factCheck.isFactual ? "Yes" : "No"
//     }\n\n`;
//     reply += `Explanation: ${analysisResult.factCheck.explanation}\n\n`;

//     if (analysisResult.warnings && analysisResult.warnings.length > 0) {
//       reply += `Warnings:\n${analysisResult.warnings
//         .map((w) => `• ${w}`)
//         .join("\n")}\n\n`;
//     }

//     if (analysisResult.suggestions && analysisResult.suggestions.length > 0) {
//       reply += `Suggestions:\n${analysisResult.suggestions
//         .map((s) => `• ${s}`)
//         .join("\n")}`;
//     }

//     res.json({
//       reply,
//       detailedAnalysis: analysisResult,
//     });
//   } catch (err) {
//     console.error("Chatbot API Error:", err.message);
//     res.status(500).json({ error: "Something went wrong during analysis" });
//   }
// });

// // Enhanced analysis endpoint with full detailed results
// router.post("/analyze", async (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     return res.status(400).json({ error: "Text is required for analysis" });
//   }

//   try {
//     const analysisResult = await analyzeText(text);
//     res.json(analysisResult);
//   } catch (err) {
//     console.error("Analysis API Error:", err.message);
//     res.status(500).json({ error: "Failed to analyze text" });
//   }
// });

// // Text improvement endpoint
// router.post("/improve", async (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     return res.status(400).json({ error: "Text is required for improvement" });
//   }

//   try {
//     const improvedText = await improveText(text);
//     res.json({ improvedText });
//   } catch (err) {
//     console.error("Text Improvement Error:", err.message);
//     res.status(500).json({ error: "Failed to improve text" });
//   }
// });

// // Reply suggestion endpoint
// router.post("/suggest-reply", async (req, res) => {
//   const { originalPost, previousComments = [] } = req.body;

//   if (!originalPost) {
//     return res.status(400).json({ error: "Original post is required" });
//   }

//   try {
//     const suggestedReply = await suggestReply(originalPost, previousComments);
//     res.json({ suggestedReply });
//   } catch (err) {
//     console.error("Reply Suggestion Error:", err.message);
//     res.status(500).json({ error: "Failed to suggest reply" });
//   }
// });

// // Content moderation endpoint
// router.post("/moderate", async (req, res) => {
//   const { text } = req.body;

//   if (!text) {
//     return res.status(400).json({ error: "Text is required for moderation" });
//   }

//   try {
//     const moderationResult = await moderateContent(text);
//     res.json(moderationResult);
//   } catch (err) {
//     console.error("Content Moderation Error:", err.message);
//     res.status(500).json({ error: "Failed to moderate content" });
//   }
// });

const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import utility functions
const { analyzeText } = require("../utils/newsAnalyzer");
const {
  improveText,
  suggestReply,
  moderateContent,
} = require("../utils/geminiHelper");

const router = express.Router();

// Original chatbot endpoint for simple misinformation detection
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("Analyzing message:", message.substring(0, 100) + "...");

    // Use the enhanced analysis function
    const analysisResult = await analyzeText(message);

    // Format response for chatbot-style interaction
    let reply = `🔍 Analysis Complete!\n\n`;
    reply += `📊 Credibility Score: ${analysisResult.credibilityScore}/100\n`;
    reply += `✅ Factual: ${
      analysisResult.factCheck.isFactual ? "Yes" : "No"
    }\n\n`;
    reply += `💡 Explanation: ${analysisResult.factCheck.explanation}\n\n`;

    if (analysisResult.warnings && analysisResult.warnings.length > 0) {
      reply += `⚠️ Warnings:\n${analysisResult.warnings
        .map((w) => `• ${w}`)
        .join("\n")}\n\n`;
    }

    if (analysisResult.suggestions && analysisResult.suggestions.length > 0) {
      reply += `💭 Suggestions:\n${analysisResult.suggestions
        .map((s) => `• ${s}`)
        .join("\n")}`;
    }

    res.json({
      reply,
      detailedAnalysis: analysisResult,
    });
  } catch (err) {
    console.error("Chatbot API Error:", err.message);
    res.status(500).json({
      error: "Something went wrong during analysis",
      details: err.message,
    });
  }
});

// Enhanced analysis endpoint with full detailed results
router.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required for analysis" });
  }

  try {
    console.log(
      "Performing detailed analysis for text:",
      text.substring(0, 100) + "..."
    );
    const analysisResult = await analyzeText(text);
    res.json(analysisResult);
  } catch (err) {
    console.error("Analysis API Error:", err.message);
    res.status(500).json({
      error: "Failed to analyze text",
      details: err.message,
    });
  }
});

// Text improvement endpoint
router.post("/improve", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required for improvement" });
  }

  try {
    console.log("Improving text:", text.substring(0, 50) + "...");
    const improvedText = await improveText(text);
    res.json({
      original: text,
      improved: improvedText,
    });
  } catch (err) {
    console.error("Text Improvement Error:", err.message);
    res.status(500).json({
      error: "Failed to improve text",
      details: err.message,
    });
  }
});

// Reply suggestion endpoint
router.post("/suggest-reply", async (req, res) => {
  const { originalPost, previousComments = [] } = req.body;

  if (!originalPost) {
    return res.status(400).json({ error: "Original post is required" });
  }

  try {
    console.log(
      "Suggesting reply for post:",
      originalPost.substring(0, 50) + "..."
    );
    const suggestedReply = await suggestReply(originalPost, previousComments);
    res.json({
      originalPost,
      suggestedReply,
      contextComments: previousComments.length,
    });
  } catch (err) {
    console.error("Reply Suggestion Error:", err.message);
    res.status(500).json({
      error: "Failed to suggest reply",
      details: err.message,
    });
  }
});

// Content moderation endpoint
router.post("/moderate", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required for moderation" });
  }

  try {
    console.log("Moderating content:", text.substring(0, 50) + "...");
    const moderationResult = await moderateContent(text);
    res.json({
      text: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
      ...moderationResult,
    });
  } catch (err) {
    console.error("Content Moderation Error:", err.message);
    res.status(500).json({
      error: "Failed to moderate content",
      details: err.message,
    });
  }
});

// Test endpoint to verify the route is working
router.get("/test", (req, res) => {
  res.json({
    message: "Chatbot routes are working!",
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      "POST /api/chatbot - Simple misinformation detection",
      "POST /api/chatbot/analyze - Detailed text analysis",
      "POST /api/chatbot/improve - Text improvement",
      "POST /api/chatbot/suggest-reply - Reply suggestions",
      "POST /api/chatbot/moderate - Content moderation",
      "GET /api/chatbot/test - This test endpoint",
    ],
  });
});

module.exports = router;
