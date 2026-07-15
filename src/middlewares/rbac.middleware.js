const { AppError } = require("../utils/AppError");

function RequireRole(...AllowedRoles) {
  return function RbacMiddleware(req, _res, next) {
    if (!req.user) {
      next(AppError.Unauthorized());
      return;
    }

    if (!AllowedRoles.includes(req.user.Role)) {
      next(AppError.Forbidden());
      return;
    }

    if (req.user.Role === "INSTRUCTOR" && req.user.Status === "PENDING") {
      next(
        AppError.Forbidden(
          "Your instructor account is pending admin approval and cannot access this resource yet"
        )
      );
      return;
    }

    next();
  };
}

module.exports = { RequireRole };
