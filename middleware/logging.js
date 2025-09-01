const morgan = require('morgan');

// Use morgan for HTTP request logging
// Formats: 'dev' for concise colored output; 'combined' for Apache-style logs
const requestLogger = morgan(process.env.MORGAN_FORMAT || 'dev');

// Error logging middleware (kept simple; rely on error handler for response)
const errorLogger = (err, req, res, next) => {
  console.error('Error:', err);
  next(err);
};

module.exports = { requestLogger, errorLogger };
