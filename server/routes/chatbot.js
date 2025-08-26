// server/routes/chatbot.js
const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const router = express.Router();

// GET route for testing - ADD THIS FIRST
router.get("/", (req, res) => {
  res.json({
    message: "Chatbot API is running. Send a POST request with a message.",
    endpoint: "/api/chatbot",
    method: "POST",
    body: { message: "Your message here" },
  });
});

// POST route for actual chatbot functionality
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      "https://api.a4f.co/v1/chat/completions",
      {
        model: "provider-3/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a chatbot named Glitchy that helps users detect misinformation.",
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Chatbot API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
