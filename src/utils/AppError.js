class AppError extends Error {
  constructor(code, message, statusCode, details) {
    super(message);
    this.Code = code;
    this.StatusCode = statusCode;
    this.Details = details;
  }

  static BadRequest(message, details) {
    return new AppError("VALIDATION_ERROR", message, 400, details);
  }

  static Unauthorized(message = "Authentication required") {
    return new AppError("UNAUTHORIZED", message, 401);
  }

  static Forbidden(message = "You do not have permission to perform this action") {
    return new AppError("FORBIDDEN", message, 403);
  }

  static NotFound(message = "Resource not found") {
    return new AppError("NOT_FOUND", message, 404);
  }

  static Conflict(message) {
    return new AppError("CONFLICT", message, 409);
  }

  static Internal(message = "Internal server error") {
    return new AppError("INTERNAL_ERROR", message, 500);
  }
}

module.exports = { AppError };
