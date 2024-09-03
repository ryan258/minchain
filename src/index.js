// src/index.js
const { preprocessText } = require('./agents/preprocessor');
const { analyzeText } = require('./agents/analyzer');
const { callLocalApi } = require('./api/localApi');
const cliInterface = require('./cli/interface');
const { handleError } = require('./utils/errorHandler');

async function runAgentChain(input) {
  try {
    // Preprocess the input
    const preprocessedData = preprocessText(input);

    // Analyze the preprocessed text
    const analysisResult = await analyzeText(preprocessedData.processedText);

    // Use local API for advanced processing
    const apiPrompt = `Analyze the following text and provide insights: "${preprocessedData.processedText}"`;
    const apiResult = await callLocalApi(apiPrompt);

    return {
      ...preprocessedData,
      analysis: analysisResult,
      apiInsights: apiResult,
    };
  } catch (error) {
    handleError(error);
    return null;
  }
}

// Set up CLI interface and handle user input
cliInterface.setupCliInterface(runAgentChain);

module.exports = {
  runAgentChain,
};