const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const { OpenAI } = require("openai");

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  baseURL: "https://api.a4f.co/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Text Fact Checking ---
router.post("/fact-check", async (req, res) => {
  try {
    const { claim } = req.body;

    const response = await client.chat.completions.create({
      model: "provider-3/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a fact-checking assistant. Verify claims based on reliable sources and clarify if information cannot be confirmed.",
        },
        {
          role: "user",
          content: `Verify this claim: ${claim}`,
        },
      ],
    });

    res.json({ result: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fact check failed" });
  }
});

// --- Image Fact Checking (OCR + Verification) ---
router.post("/fact-check-image", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini", // supports vision
      messages: [
        {
          role: "system",
          content: "You are a fact-checking assistant.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Verify the content in this image for misinformation.",
            },
            {
              type: "image_url",
              image_url: `data:image/png;base64,${fs
                .readFileSync(filePath)
                .toString("base64")}`,
            },
          ],
        },
      ],
    });

    res.json({ result: response.choices[0].message.content });

    // cleanup
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image fact check failed" });
  }
});

module.exports = router;
