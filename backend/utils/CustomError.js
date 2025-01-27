// CustomError.js
export default class CustomError extends Error {
  /**
   * Creates an instance of CustomError.
   * @param {string} message - Error message.
   * @param {number} statusCode - HTTP status code.
   * @param {string} errorCode - Custom application-specific error code.
   */
  constructor(message, statusCode, errorCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.errorCode = errorCode || "INTERNAL_SERVER_ERROR";
    Error.captureStackTrace(this, this.constructor);
  }
}
