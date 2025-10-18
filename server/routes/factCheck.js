const express = require("express");
const factCheckController = require("../controllers/factCheck.js");
const router = express.Router();

// POST /api/check
router.post("/check", factCheckController.checkClaim);

module.exports = router;
