// src/api/localApi.js
const axios = require('axios');
const { AppError } = require('../utils/errorHandler');

const API_URL = 'http://localhost:11434/api/generate';

async function callLocalApi(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new AppError('Invalid input: prompt must be a non-empty string', 400);
  }

  try {
    const response = await axios.post(API_URL, {
      model: "llama3.1:latest",
      prompt: prompt,
      stream: false
    });

    if (response.data && response.data.response) {
      return response.data.response;
    } else {
      throw new AppError('Unexpected API response format', 500);
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new AppError(`API request failed: ${error.response.data}`, error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      throw new AppError('No response received from API', 503);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new AppError(`Error setting up API request: ${error.message}`, 500);
    }
  }
}

module.exports = {
  callLocalApi,
};