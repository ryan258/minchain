// src/agents/preprocessor.js
const natural = require('natural');
const { AppError } = require('../utils/errorHandler');

function preprocessText(text) {
  if (!text || typeof text !== 'string') {
    throw new AppError('Invalid input: text must be a non-empty string', 400);
  }

  // Convert text to lowercase
  let processedText = text.toLowerCase();

  // Remove special characters, keeping only letters, numbers, and spaces
  processedText = processedText.replace(/[^a-z0-9\s]/g, '');

  // Tokenize the text
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(processedText);

  // Remove stop words
  const stopwords = new Set(natural.stopwords);
  const filteredTokens = tokens.filter(token => !stopwords.has(token));

  return {
    originalText: text,
    processedText: processedText,
    tokens: filteredTokens
  };
}

module.exports = {
  preprocessText,
};