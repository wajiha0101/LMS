const { AppError } = require("../utils/AppError");

function requireRole(...allowedRoles) {
  return function rbacMiddleware(req, _res, next) {
    if (!req.user) {
      next(AppError.Unauthorized());
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(AppError.Forbidden());
      return;
    }

    if (req.user.role === "INSTRUCTOR" && req.user.status === "PENDING") {
      next(
        AppError.Forbidden(
          "Your instructor account is pending admin approval and cannot access this resource yet"
        )
      );
      return;
    }

    if (req.user.role === "INSTRUCTOR" && req.user.status === "REJECTED") {
      next(
        AppError.Forbidden(
          "Your instructor application was rejected and cannot access this resource"
        )
      );
      return;
    }

    next();
  };
}

module.exports = { requireRole };
