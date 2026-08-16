const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  // Log all errors in development
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Don't overwrite status if already set to an error code
  let statusCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  // Multer errors (file upload)
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') message = 'File quá lớn. Tối đa 50MB.';
    else if (err.code === 'LIMIT_FILE_COUNT') message = 'Tối đa 10 files.';
    else if (err.code === 'LIMIT_UNEXPECTED_FILE') message = 'File type không được hỗ trợ.';
    else message = `Upload error: ${err.message}`;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Giá trị '${field}' đã tồn tại`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token không hợp lệ';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token đã hết hạn';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
