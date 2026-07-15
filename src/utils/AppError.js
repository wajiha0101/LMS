class AppError extends Error {
  constructor(Code, Message, StatusCode, Details) {
    super(Message);
    this.Code = Code;
    this.StatusCode = StatusCode;
    this.Details = Details;
  }

  static BadRequest(Message, Details) {
    return new AppError("VALIDATION_ERROR", Message, 400, Details);
  }

  static Unauthorized(Message = "Authentication required") {
    return new AppError("UNAUTHORIZED", Message, 401);
  }

  static Forbidden(Message = "You do not have permission to perform this action") {
    return new AppError("FORBIDDEN", Message, 403);
  }

  static NotFound(Message = "Resource not found") {
    return new AppError("NOT_FOUND", Message, 404);
  }

  static Conflict(Message) {
    return new AppError("CONFLICT", Message, 409);
  }

  static Internal(Message = "Internal server error") {
    return new AppError("INTERNAL_ERROR", Message, 500);
  }
}

module.exports = { AppError };
