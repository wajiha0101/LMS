const { VerifyAccessToken } = require("../lib/jwt");
const { AppError } = require("../utils/AppError");

function AuthMiddleware(req, _res, next) {
  const Header = req.headers.authorization;

  if (!Header || !Header.startsWith("Bearer ")) {
    next(AppError.Unauthorized("Missing or malformed Authorization header"));
    return;
  }

  const Token = Header.slice("Bearer ".length);

  try {
    const Payload = VerifyAccessToken(Token);

    if (Payload.status === "SUSPENDED") {
      next(AppError.Forbidden("This account has been suspended"));
      return;
    }

    req.user = {
      Id: Payload.sub,
      Role: Payload.role,
      Status: Payload.status,
    };
    next();
  } catch {
    next(AppError.Unauthorized("Invalid or expired access token"));
  }
}

module.exports = { AuthMiddleware };
