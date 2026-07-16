const { verifyAccessToken } = require("../lib/jwt");
const { AppError } = require("../utils/AppError");

function authMiddleware(req, _res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    next(AppError.Unauthorized("Missing or malformed Authorization header"));
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);

    if (payload.status === "SUSPENDED") {
      next(AppError.Forbidden("This account has been suspended"));
      return;
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
      status: payload.status,
    };
    next();
  } catch {
    next(AppError.Unauthorized("Invalid or expired access token"));
  }
}

module.exports = { authMiddleware };
