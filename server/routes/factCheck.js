const apiClient = require("../utils/api.js");
const config = require("../config");

exports.verifyClaim = async (claim) => {
  console.log(`[SERVICE] 1. Received claim: "${claim}"`);

  try {
    console.log("[SERVICE] 2. Calling apiClient.fetchSearchResults...");
    const searchResults = await apiClient.fetchSearchResults(claim);
    console.log("[SERVICE] 3. COMPLETED apiClient.fetchSearchResults.");

    // This check is now even more important.
    if (!searchResults || searchResults.length === 0) {
      console.log("[SERVICE] No search results found for this recent claim.");
      // We can handle this gracefully instead of throwing an error.
      return {
        conclusion: "Insufficient Information",
        summary:
          "No credible news reports or information could be found for this claim in recent search results. This may be because the event is too new, not widely reported, or based on a rumor.",
        sources: [],
      };
    }
    console.log(`[SERVICE] 4. Found ${searchResults.length} search results.`);

    const searchContext = searchResults
      .map(
        (item, index) =>
          `Source [${index + 1}]:\nTitle: ${item.title}\nLink: ${
            item.link
          }\nSnippet: ${item.snippet}`
      )
      .join("\n\n");

    // --- UPDATED NEWS-FOCUSED PROMPT ---
    const prompt = `
      You are a meticulous fact-checking assistant and news analyst. Your task is to analyze the user's claim about a recent event based ONLY on the provided search results. Do not use any prior knowledge.

      User's Claim: "${claim}"

      Search Results:
      ---
      ${searchContext}
      ---

      Based strictly on the provided search results, perform the following actions:
      1.  **Analyze Source Credibility and Timeliness:** Assess the search results. Are they from major news outlets, local news, blogs, or forums? How recent are they?
      2.  **Synthesize a Neutral Summary:** Write a concise summary of what the search results indicate. 
          - If sources confirm the event, summarize it.
          - If sources contradict each other or contain speculation, your summary MUST state that the information is still developing or that reports are conflicting.
          - If the sources are of low quality (e.g., only forums), state that there are no credible reports.
      3.  **Determine a Conclusion:**
          - "Supported": If multiple credible sources corroborate the claim.
          - "Refuted": If credible sources deny the claim.
          - "Insufficient Information": If the news is still developing, sources conflict, are of low quality, or don't directly address the user's claim. This is the default for breaking news.
      4.  **List Sources:** Provide the URLs so the user can read the articles themselves.

      Respond in a valid JSON object with this exact structure:
      {
        "conclusion": "Supported" | "Refuted" | "Insufficient Information",
        "summary": "Your detailed, analytical summary here.",
        "sources": ["url1", "url2", ...]
      }
    `;

    console.log("[SERVICE] 5. Calling apiClient.fetchAiResponse...");
    const aiResponse = await apiClient.fetchAiResponse(prompt);
    console.log("[SERVICE] 6. COMPLETED apiClient.fetchAiResponse.");

    return aiResponse;
  } catch (error) {
    console.error("!!! [SERVICE] CRITICAL ERROR:", error.message);
    throw error;
  }
};
