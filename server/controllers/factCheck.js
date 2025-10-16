const factCheckService = require("../services/factCheck.js");

exports.checkClaim = async (req, res, next) => {
  console.log("[CONTROLLER] Request received for /check endpoint.");

  const { query } = req.body;

  if (!query || typeof query !== "string") {
    console.error(
      "[CONTROLLER] Validation failed: Query is missing or not a string."
    );
    return res.status(400).json({ error: "Query must be a non-empty string." });
  }

  console.log(`[CONTROLLER] Query extracted: "${query}"`);

  try {
    console.log("[CONTROLLER] Calling factCheckService.verifyClaim...");
    const result = await factCheckService.verifyClaim(query);
    console.log("[CONTROLLER] Service call successful. Sending response.");
    res.status(200).json(result);
  } catch (error) {
    console.error(
      "[CONTROLLER] Error received from service. Passing to error handler."
    );
    next(error);
  }
};
