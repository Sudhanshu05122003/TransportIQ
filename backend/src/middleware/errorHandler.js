/**
 * Global Error Handler Middleware
 */

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log error for debugging
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    errors: err.errors || null
  });
};

module.exports = {
  notFound,
  errorHandler
};
