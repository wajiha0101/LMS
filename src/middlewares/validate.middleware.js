const { ZodError } = require("zod");
const { AppError } = require("../utils/AppError");

function validate(schema, source = "body") {
  return function validateMiddleware(req, _res, next) {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        next(AppError.BadRequest("Validation failed", details));
        return;
      }
      next(error);
    }
  };
}

module.exports = { validate };
