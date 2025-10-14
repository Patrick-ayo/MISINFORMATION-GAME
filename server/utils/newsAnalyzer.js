const { callGeminiWithRetry } = require("./geminiHelper");
const { searchSerper } = require("./serperApi");

// Define trusted news sources with their search URLs
const TRUSTED_SOURCES = {
  reuters: {
    domain: "reuters.com",
    searchUrl: "https://www.reuters.com/site-search/?query=",
    reliability: 95,
  },
  ap: {
    domain: "apnews.com",
    searchUrl: "https://apnews.com/search?q=",
    reliability: 95,
  },
  bbc: {
    domain: "bbc.com",
    searchUrl: "https://www.bbc.co.uk/search?q=",
    reliability: 90,
  },
  nature: {
    domain: "nature.com",
    searchUrl: "https://www.nature.com/search?q=",
    reliability: 98,
  },
  who: {
    domain: "who.int",
    searchUrl:
      "https://www.who.int/home/search?indexCatalogue=genericsearchindex1&searchQuery=",
    reliability: 95,
  },
  aljazeera: {
    domain: "aljazeera.com",
    searchUrl: "https://www.aljazeera.com/search/",
    reliability: 85,
  },
  dw: {
    domain: "dw.com",
    searchUrl: "https://www.dw.com/search/",
    reliability: 88,
  },
  france24: {
    domain: "france24.com",
    searchUrl: "https://www.france24.com/en/search/",
    reliability: 87,
  },
  thehindu: {
    domain: "thehindu.com",
    searchUrl: "https://www.thehindu.com/search/?q=",
    reliability: 88,
  },
  indianexpress: {
    domain: "indianexpress.com",
    searchUrl: "https://indianexpress.com/?s=",
    reliability: 87,
  },
  timesOfIndia: {
    domain: "timesofindia.indiatimes.com",
    searchUrl: "https://timesofindia.indiatimes.com/topic/",
    reliability: 85,
  },
};

// Emotional words for analysis
const emotionalWords = {
  positive: [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "positive",
    "success",
    "breakthrough",
  ],
  negative: [
    "bad",
    "terrible",
    "awful",
    "horrible",
    "poor",
    "negative",
    "failure",
    "crisis",
  ],
  urgent: [
    "breaking",
    "urgent",
    "emergency",
    "crisis",
    "immediately",
    "critical",
    "vital",
    "crucial",
  ],
};

/**
 * Calculate content statistics
 * @param {string} text - Text to analyze
 * @returns {Promise<import('./types').ContentStatistics>} Content statistics
 */
const calculateContentStatistics = async (text) => {
  const words = text.trim().split(/\s+/);
  const sentences = text.split(/[.!?।|॥]+/).filter(Boolean);
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  const readingTimeMinutes = Math.ceil(words.length / 200);

  // Use Gemini to extract keywords
  let topKeywords = [];
  try {
    const prompt = `Analyze this text and extract the 5 most important keywords or key phrases that best represent its main topics and themes. Provide the response in English.

Text to analyze: "${text}"

Response format example:
["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const result = await callGeminiWithRetry(payload);
    const responseText =
      result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      topKeywords = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse Gemini keywords response:", parseError);
      topKeywords = extractKeywords(text);
    }
  } catch (error) {
    console.error("Gemini keyword extraction failed:", error);
    topKeywords = extractKeywords(text);
  }

  // Calculate emotional tone indicators
  const emotionalTone = Object.entries(emotionalWords).reduce(
    (acc, [tone, words]) => {
      const count = words.reduce(
        (sum, word) =>
          sum +
          (text.toLowerCase().match(new RegExp(`\\b${word}\\b`, "gi"))
            ?.length || 0),
        0
      );
      return { ...acc, [tone]: count };
    },
    {}
  );

  return {
    wordCount: words.length,
    averageSentenceLength: Math.round(words.length / sentences.length) || 0,
    paragraphCount: paragraphs.length,
    complexWords: words.filter((word) => word.length > 6).length,
    readingTimeMinutes,
    topKeywords,
    emotionalTone,
    uniqueWords: new Set(words.map((w) => w.toLowerCase())).size,
    averageWordLength:
      words.reduce((sum, word) => sum + word.length, 0) / words.length || 0,
  };
};

/**
 * Extract keywords from text
 * @param {string} text - Text to analyze
 * @returns {string[]} Array of keywords
 */
const extractKeywords = (text) => {
  const STOP_WORDS = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "were",
    "will",
    "with",
  ]);

  const words = text.toLowerCase().split(/\s+/);
  const wordFrequency = {};

  words.forEach((word, index) => {
    const cleanWord = word.replace(/[^\p{L}\p{N}']/gu, "");
    if (cleanWord && cleanWord.length > 2 && !STOP_WORDS.has(cleanWord)) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;

      if (index < words.length - 1) {
        const nextWord = words[index + 1].replace(/[^\p{L}\p{N}']/gu, "");
        if (nextWord && !STOP_WORDS.has(nextWord)) {
          const bigram = `${cleanWord} ${nextWord}`;
          wordFrequency[bigram] = (wordFrequency[bigram] || 0) + 1;
        }
      }
    }
  });

  return Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
};

/**
 * Analyze timeline for dates and inconsistencies
 * @param {string} text - Text to analyze
 * @returns {import('./types').TimelineAnalysis} Timeline analysis
 */
const analyzeTimeline = (text) => {
  const datePattern =
    /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?\s*,?\s*\d{4}\b/gi;
  const dates = text.match(datePattern) || [];

  return {
    datesFound: dates,
    hasInconsistencies:
      dates.length > 1 && new Set(dates).size !== dates.length,
    timespan:
      dates.length > 0
        ? {
            earliest: new Date(dates[0]),
            latest: new Date(dates[dates.length - 1]),
          }
        : null,
  };
};

/**
 * Analyze citations in the text
 * @param {string} text - Text to analyze
 * @returns {import('./types').CitationAnalysis} Citation analysis
 */
const analyzeCitations = (text) => {
  const citations = {
    academic: text.match(/\b(?:doi:|10\.\d{4,}\/[-._;()\/:A-Z0-9]+)\b/gi) || [],
    quotes: text.match(/"([^"]*)"|\u201C([^\u201D]*)\u201D/g) || [],
    urls: text.match(/https?:\/\/[^\s<>)"]+/g) || [],
  };

  return {
    hasCitations: Object.values(citations).some((arr) => arr.length > 0),
    citationCount: Object.values(citations).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
    citations,
  };
};

/**
 * Get relevant article searches based on keywords
 * @param {string[]} keywords - Keywords to search for
 * @returns {import('./types').DetailedSource[]} Array of search sources
 */
const getRelevantArticleSearches = (keywords) => {
  const searchQuery = encodeURIComponent(keywords.slice(0, 3).join(" "));
  return [
    {
      url: `${TRUSTED_SOURCES.reuters.searchUrl}${searchQuery}`,
      title: "Search Reuters for related articles",
      reliability: TRUSTED_SOURCES.reuters.reliability,
      verificationDetails: [
        "Click to search for related articles from this trusted source",
        "Compare the content with verified news coverage",
        "Check dates and details for accuracy",
        "Verify claims against multiple sources",
      ],
    },
    {
      url: `${TRUSTED_SOURCES.ap.searchUrl}${searchQuery}`,
      title: "Find related AP News coverage",
      reliability: TRUSTED_SOURCES.ap.reliability,
      verificationDetails: [
        "Click to search for related articles from this trusted source",
        "Compare the content with verified news coverage",
        "Check dates and details for accuracy",
        "Verify claims against multiple sources",
      ],
    },
    {
      url: `${TRUSTED_SOURCES.bbc.searchUrl}${searchQuery}`,
      title: "Search BBC News for similar stories",
      reliability: TRUSTED_SOURCES.bbc.reliability,
      verificationDetails: [
        "Click to search for related articles from this trusted source",
        "Compare the content with verified news coverage",
        "Check dates and details for accuracy",
        "Verify claims against multiple sources",
      ],
    },
  ];
};

/**
 * Main text analysis function
 * @param {string} text - Text to analyze
 * @returns {Promise<import('./types').AnalysisResult>} Analysis result
 */
const analyzeText = async (text) => {
  if (!process.env.GEMINI_API_KEY) {
    const message =
      "API key not configured. Please add your Gemini API key to the .env file.";
    const suggestion =
      "Get an API key from Google AI Studio (https://makersuite.google.com/app/apikey)";

    return {
      credibilityScore: 0,
      warnings: [message],
      suggestions: [suggestion],
      factCheck: {
        isFactual: false,
        explanation: "Unable to perform analysis: Missing API key",
      },
      statistics: await calculateContentStatistics(text),
    };
  }

  try {
    // First, calculate statistics to get keywords for Serper search
    const statistics = await calculateContentStatistics(text);
    const keywordsForSearch = statistics.topKeywords.join(" ");

    let serperResultsContent = "";
    let serperSources = [];

    if (keywordsForSearch) {
      const serperResults = await searchSerper(keywordsForSearch);
      if (serperResults.length > 0) {
        serperResultsContent = "\n\n--- Live Search Results ---\n";
        serperResults.slice(0, 5).forEach((result, index) => {
          serperResultsContent += `Result ${index + 1}:\nTitle: ${
            result.title
          }\nURL: ${result.link}\nSnippet: ${result.snippet}\n\n`;
          serperSources.push({
            url: result.link,
            title: result.title,
            snippet: result.snippet,
            reliability: 70,
            verificationDetails: ["Information from this live search result"],
          });
        });
        serperResultsContent += "---------------------------\n\n";
      }
    }

    const prompt = `You are a fact-checking system that ONLY responds with valid JSON. Analyze the following content and provide the response in English.

CRITICAL: Use the provided "Live Search Results" to inform your factual assessment and credibility score. Prioritize information from these live results if it directly contradicts or supports claims in the main text.

Your task is to analyze the following text for credibility and misinformation.

CRITICAL: Your response MUST be a single JSON object with EXACTLY this structure:
{
  "isFactual": boolean,
  "credibilityScore": number between 0 and 100,
  "warnings": string[],
  "explanation": string,
  "suggestions": string[],
  "sentiment": {
    "score": number between -1 and 1,
    "label": "negative" | "neutral" | "positive"
  },
  "readability": {
    "score": number between 0 and 100,
    "level": "Easy" | "Medium" | "Hard",
    "suggestions": string[]
  },
  "bias": {
    "score": number between 0 and 100,
    "type": string,
    "explanation": string
  }
}

Text to analyze: "${text}"
${serperResultsContent}
`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const result = await callGeminiWithRetry(payload);
    const responseText =
      result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      analysis = JSON.parse(jsonString);

      const timelineAnalysis = analyzeTimeline(text);
      const citationAnalysis = analyzeCitations(text);

      const relevantSources = getRelevantArticleSearches(
        statistics.topKeywords
      );

      const combinedSources = [...serperSources, ...relevantSources];

      return {
        credibilityScore: Math.min(100, Math.max(0, analysis.credibilityScore)),
        warnings: analysis.warnings,
        suggestions: analysis.suggestions,
        factCheck: {
          isFactual: analysis.isFactual,
          explanation: analysis.explanation,
          sources: combinedSources,
        },
        sentiment: analysis.sentiment,
        readability: analysis.readability,
        bias: analysis.bias,
        statistics,
        timeline: timelineAnalysis,
        citations: citationAnalysis,
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      throw new Error(`Invalid response format: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Gemini API Error:", error);

    const apiError = "Unable to perform analysis due to an API error.";
    const keyCheck =
      "Please ensure your API key is valid and has sufficient quota.";

    const statistics = await calculateContentStatistics(text);
    const timelineAnalysis = analyzeTimeline(text);
    const citationAnalysis = analyzeCitations(text);

    return {
      credibilityScore: 0,
      warnings: [apiError, keyCheck],
      suggestions: [
        "Check your API key configuration",
        "Try again in a few moments",
        "If the problem persists, verify your API key at https://makersuite.google.com/app/apikey",
      ],
      factCheck: {
        isFactual: false,
        explanation: "Analysis unavailable: " + (error.message || "API Error"),
      },
      statistics,
      timeline: timelineAnalysis,
      citations: citationAnalysis,
    };
  }
};

module.exports = {
  analyzeText,
  calculateContentStatistics,
  analyzeTimeline,
  analyzeCitations,
  getRelevantArticleSearches,
};
