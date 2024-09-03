// src/agents/analyzer.js
const natural = require('natural');
const { AppError } = require('../utils/errorHandler');

async function analyzeText(preprocessedText) {
  if (!preprocessedText || typeof preprocessedText !== 'string') {
    throw new AppError('Invalid input: preprocessed text must be a non-empty string', 400);
  }

  // Perform sentiment analysis
  const sentiment = analyzeSentiment(preprocessedText);

  // Extract key topics
  const topics = extractTopics(preprocessedText);

  return {
    sentiment,
    topics,
  };
}

function analyzeSentiment(text) {
  const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  const tokens = new natural.WordTokenizer().tokenize(text);
  const sentiment = analyzer.getSentiment(tokens);

  // Normalize sentiment to a scale of -1 to 1
  return Math.max(-1, Math.min(1, sentiment));
}

function extractTopics(text) {
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(text);

  const topics = [];
  tfidf.listTerms(0 /* document index */).forEach((item) => {
    if (item.term.length > 2) {  // Ignore very short terms
      topics.push({
        term: item.term,
        tfidf: item.tfidf
      });
    }
  });

  // Sort topics by TF-IDF score and return top 5
  return topics.sort((a, b) => b.tfidf - a.tfidf).slice(0, 5);
}

module.exports = {
  analyzeText,
};