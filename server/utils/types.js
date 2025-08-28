// Type definitions for the misinformation detection system

/**
 * @typedef {Object} SourceVerification
 * @property {string} url
 * @property {number} reliability
 * @property {string} lastUpdated
 * @property {string} domain
 * @property {'News'|'Academic'|'Government'|'Social Media'|'Blog'|'Other'} category
 */

/**
 * @typedef {Object} ContentStatistics
 * @property {number} wordCount
 * @property {number} averageSentenceLength
 * @property {number} paragraphCount
 * @property {number} complexWords
 * @property {number} readingTimeMinutes
 * @property {string[]} topKeywords
 * @property {Object} emotionalTone
 * @property {number} emotionalTone.positive
 * @property {number} emotionalTone.negative
 * @property {number} emotionalTone.urgent
 * @property {number} uniqueWords
 * @property {number} averageWordLength
 */

/**
 * @typedef {Object} TimelineAnalysis
 * @property {string[]} datesFound
 * @property {boolean} hasInconsistencies
 * @property {Object|null} timespan
 * @property {Date} timespan.earliest
 * @property {Date} timespan.latest
 */

/**
 * @typedef {Object} CitationAnalysis
 * @property {boolean} hasCitations
 * @property {number} citationCount
 * @property {Object} citations
 * @property {string[]} citations.academic
 * @property {string[]} citations.quotes
 * @property {string[]} citations.urls
 */

/**
 * @typedef {Object} HistoricalAnalysis
 * @property {string} id
 * @property {string} timestamp
 * @property {string} text
 * @property {AnalysisResult} result
 * @property {ContentStatistics} statistics
 */

/**
 * @typedef {Object} DetailedSource
 * @property {string} url
 * @property {string} title
 * @property {string} [publishDate]
 * @property {string} [author]
 * @property {number} reliability
 * @property {string[]} verificationDetails
 * @property {string} [snippet]
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {number} credibilityScore
 * @property {string[]} warnings
 * @property {string[]} suggestions
 * @property {Object} factCheck
 * @property {boolean} factCheck.isFactual
 * @property {string} factCheck.explanation
 * @property {DetailedSource[]} [factCheck.sources]
 * @property {Object} [sentiment]
 * @property {number} sentiment.score
 * @property {'negative'|'neutral'|'positive'} sentiment.label
 * @property {Object} [readability]
 * @property {number} readability.score
 * @property {'Easy'|'Medium'|'Hard'} readability.level
 * @property {string[]} readability.suggestions
 * @property {Object} [bias]
 * @property {number} bias.score
 * @property {string} bias.type
 * @property {string} bias.explanation
 * @property {ContentStatistics} statistics
 * @property {TimelineAnalysis} [timeline]
 * @property {CitationAnalysis} [citations]
 * @property {SourceVerification[]} [sourceVerification]
 * @property {string} [extractedText]
 */

/**
 * @typedef {Object} NewsArticle
 * @property {string} id
 * @property {string} title
 * @property {string} source
 * @property {string} publishedAt
 * @property {string} url
 * @property {number} credibilityScore
 * @property {string} summary
 * @property {string[]} warnings
 * @property {string[]} verifiedClaims
 * @property {Object} engagement
 * @property {number} engagement.likes
 * @property {number} engagement.comments
 * @property {number} engagement.shares
 */

/**
 * @typedef {Object} SerperOrganicResult
 * @property {string} title
 * @property {string} link
 * @property {string} snippet
 * @property {string} [date]
 * @property {string} [imageUrl]
 * @property {string} [source]
 */

/**
 * @typedef {Object} SerperAPIResponse
 * @property {SerperOrganicResult[]} organic
 */

module.exports = {
  // Export type definitions for JSDoc usage
};
