const jwt = require("jsonwebtoken");

function getAccessSecret() {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not set");
  }
  return secret;
}

function getRefreshSecret() {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not set");
  }
  return secret;
}

function signAccessToken(payload) {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRY ?? "15m",
  });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRY ?? "7d",
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, getAccessSecret());
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshSecret());
}

function getRefreshCookieMaxAgeMs() {
  const expiry = process.env.JWT_REFRESH_EXPIRY ?? "7d";
  const match = expiry.match(/^(\d+)([smhd])$/);

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];
  const unitMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * unitMs[unit];
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshCookieMaxAgeMs,
};
