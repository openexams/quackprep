import { UNAUTHORIZED } from "../../error_codes.js";

// CustomError.js
export default class ApiError extends Error {
  constructor(message, statusCode, errorCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export class BadRequestError extends ApiError {
  constructor(message, errorCode = "BAD_REQUEST", details = null) {
    super(message, 400, errorCode, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(
    message = "You are not authorized to perform this action",
    errorCode = UNAUTHORIZED,
    details = null
  ) {
    super(message, 401, errorCode, details);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden", errorCode = "FORBIDDEN", details = null) {
    super(message, 403, errorCode, details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not Found", errorCode = "NOT_FOUND", details = null) {
    super(message, 404, errorCode, details);
  }
}

export class InternalServerError extends ApiError {
  constructor(
    message = "Internal Server Error",
    errorCode = "INTERNAL_SERVER_ERROR",
    details = null
  ) {
    super(message, 500, errorCode, details);
  }
}
