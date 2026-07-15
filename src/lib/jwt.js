const jwt = require("jsonwebtoken");

function GetAccessSecret() {
  const Secret = process.env.JWT_ACCESS_SECRET;
  if (!Secret) {
    throw new Error("JWT_ACCESS_SECRET is not set");
  }
  return Secret;
}

function GetRefreshSecret() {
  const Secret = process.env.JWT_REFRESH_SECRET;
  if (!Secret) {
    throw new Error("JWT_REFRESH_SECRET is not set");
  }
  return Secret;
}

function SignAccessToken(Payload) {
  return jwt.sign(Payload, GetAccessSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRY ?? "15m",
  });
}

function SignRefreshToken(Payload) {
  return jwt.sign(Payload, GetRefreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRY ?? "7d",
  });
}

function VerifyAccessToken(Token) {
  return jwt.verify(Token, GetAccessSecret());
}

function VerifyRefreshToken(Token) {
  return jwt.verify(Token, GetRefreshSecret());
}

function GetRefreshCookieMaxAgeMs() {
  const Expiry = process.env.JWT_REFRESH_EXPIRY ?? "7d";
  const Match = Expiry.match(/^(\d+)([smhd])$/);

  if (!Match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const Value = parseInt(Match[1], 10);
  const Unit = Match[2];
  const UnitMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return Value * UnitMs[Unit];
}

module.exports = {
  SignAccessToken,
  SignRefreshToken,
  VerifyAccessToken,
  VerifyRefreshToken,
  GetRefreshCookieMaxAgeMs,
};
