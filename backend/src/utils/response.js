/**
 * Standard Response Helpers
 */

/**
 * Send success response
 */
const success = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

/**
 * Send error response
 */
const error = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    errors
  });
};

module.exports = {
  success,
  error
};
