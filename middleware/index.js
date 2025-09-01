const { setupSecurityMiddleware } = require('./security');
const { requestLogger, errorLogger } = require('./logging');
const { errorHandler, notFoundHandler } = require('./errorHandler');
const { handleValidationErrors } = require('./validation');
const validationSchemas = require('./validationSchemas');

module.exports = {
  setupSecurityMiddleware,
  requestLogger,
  errorLogger,
  errorHandler,
  notFoundHandler,
  handleValidationErrors,
  validationSchemas
};
