const express = require("express");
const auth = require("../middleware/auth.js");
const History = require("../models/History.js");

const router = express.Router();

// Add history
router.post("/", auth, async (req, res) => {
  try {
    const { query, resultSummary, sourceUrl } = req.body;
    const rec = await History.create({
      user: req.user._id,
      query,
      resultSummary,
      sourceUrl,
    });
    res.json({ ok: true, record: rec });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get history
router.get("/", auth, async (req, res) => {
  try {
    const items = await History.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ ok: true, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
