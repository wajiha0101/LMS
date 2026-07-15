const { ZodError } = require("zod");
const { AppError } = require("../utils/AppError");

function Validate(Schema, Source = "body") {
  return function ValidateMiddleware(req, _res, next) {
    try {
      const Parsed = Schema.parse(req[Source]);
      req[Source] = Parsed;
      next();
    } catch (Error) {
      if (Error instanceof ZodError) {
        const Details = Error.errors.map((Issue) => ({
          Path: Issue.path.join("."),
          Message: Issue.message,
        }));
        next(AppError.BadRequest("Validation failed", Details));
        return;
      }
      next(Error);
    }
  };
}

module.exports = { Validate };
