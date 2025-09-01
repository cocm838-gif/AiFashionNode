/**
 * Success response with data
 * @param {Object} res - Express response object
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const successResponseWithData = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data
  });
};

/**
 * Success response with custom data
 * @param {Object} res - Express response object
 * @param {Object} data - Response data as a object
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const successResponseWithCustomData = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    ...data
  });
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 */
const errorResponse = (res, message = 'Error occurred', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    message: message
  });
};

/**
 * Validation error response with data
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {Object} data - Additional error data
 * @param {number} statusCode - HTTP status code
 */
const validationErrorWithData = (res, message, data = null, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: 'Validation Error',
    message: message,
    details: data
  });
};

/**
 * Error response with data
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {Object} data - Additional error data
 * @param {number} statusCode - HTTP status code
 */
const errorResponseWithData = (res, message, data = null, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    message: message,
    details: data
  });
};

module.exports = {
  successResponseWithData,
  successResponseWithCustomData,
  errorResponse,
  validationErrorWithData,
  errorResponseWithData
};
