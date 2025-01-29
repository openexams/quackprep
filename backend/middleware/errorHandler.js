import ApiError from "#utils/ApiError.js";
// returns error in format and sends a res to the client
/**
 * Global error handling middleware that processes errors and sends formatted responses
 * @param {Error} err - The error object caught by Express
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void} Sends JSON response to client
 */
export function errorHandler(err, req, res, next) {
  // Check if this is being called as middleware without proper params
  if (!req || !res || !err) {
    console.error("ErrorHandler called with missing parameters:", {
      hasError: !!err,
      hasRequest: !!req,
      hasResponse: !!res,
    });
    // If called directly without proper Express context, throw
    if (!req && !res) {
      throw new Error("Request or response not found in errorHandler");
    }
  }

  // Log error for debugging
  console.error("[Error]:", {
    timestamp: new Date().toISOString(),
    path: req?.url,
    method: req?.method,
    error: err,
  });

  // If it's our custom API error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      errorCode: err.errorCode,
      message: err.message,
      details: err.details,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Handle MySQL errors
  else if (err.code && err.code.startsWith("ER_")) {
    return res.status(500).json({
      status: "error",
      errorCode: "DATABASE_ERROR",
      message: "Database operation failed",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
  } else {
    // Default error
    return res.status(500).json({
      status: "error",
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
}
