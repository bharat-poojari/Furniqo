const errorHandler = (err, req, res, next) => {
  const requestId = req?.id || req?.headers?.['x-request-id'] || 'unknown';
  console.error(`[${new Date().toISOString()}] [RequestId:${requestId}]`, err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    requestId,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;