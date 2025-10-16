// A simple global error handler
exports.errorHandler = (err, req, res, next) => {
  console.error(err); // Log the full error to the console

  const statusCode = err.statusCode || 500;
  const message =
    err.message || "An unexpected internal server error occurred.";

  res.status(statusCode).json({
    error: message,
  });
};
