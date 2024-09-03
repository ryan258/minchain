// src/utils/errorHandler.js

const chalk = require('chalk');

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

function handleError(error, res = null) {
  console.error(chalk.red('Error occurred:'), error);

  if (error instanceof AppError) {
    if (res && !res.headersSent) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }
  } else {
    // For unknown errors, we don't want to leak error details
    const message = 'Something went wrong';
    if (res && !res.headersSent) {
      return res.status(500).json({
        status: 'error',
        message: message,
      });
    }
  }

  // If we can't send a response (e.g., the error occurred outside of a request-response cycle),
  // we'll just log the error
  console.error(chalk.red('Unhandled error:'), error);
}

module.exports = {
  AppError,
  handleError,
};