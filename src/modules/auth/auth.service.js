const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { prisma } = require("../../lib/prisma");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../../lib/jwt");
const { sendPasswordResetEmail } = require("../../lib/resend");
const { AppError } = require("../../utils/AppError");

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

function getSaltRounds() {
  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "12", 10);
  return Number.isNaN(rounds) ? 12 : rounds;
}

async function registerUser(input) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

  if (existingUser) {
    throw AppError.Conflict("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, getSaltRounds());

  const createdUser = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: passwordHash,
      role: input.role,
      status: input.role === "INSTRUCTOR" ? "PENDING" : "ACTIVE",
      ...(input.role === "INSTRUCTOR" ? { instructorProfile: { create: {} } } : {}),
    },
  });

  return sanitizeUser(createdUser);
}

async function loginUser(input) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw AppError.Unauthorized("Invalid email or password");
  }

  if (user.status === "SUSPENDED") {
    throw AppError.Forbidden("This account has been suspended");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw AppError.Unauthorized("Invalid email or password");
  }

  const tokenPayload = { sub: user.id, role: user.role, status: user.status };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

async function refreshSession(refreshTokenCookie) {
  if (!refreshTokenCookie) {
    throw AppError.Unauthorized("Missing refresh token");
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshTokenCookie);
  } catch {
    throw AppError.Unauthorized("Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });

  if (!user) {
    throw AppError.Unauthorized("User no longer exists");
  }

  if (user.status === "SUSPENDED") {
    throw AppError.Forbidden("This account has been suspended");
  }

  const tokenPayload = { sub: user.id, role: user.role, status: user.status };
  const accessToken = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken: newRefreshToken,
  };
}

function generateResetCode() {
  return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
}

async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const code = generateResetCode();
    const codeHash = await bcrypt.hash(code, getSaltRounds());
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: codeHash, resetTokenExpiry: expiry },
    });

    await sendPasswordResetEmail(user.email, code);
  }
}

async function resetPassword(email, code, newPassword) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.resetToken || !user.resetTokenExpiry) {
    throw AppError.BadRequest("Invalid or expired code");
  }

  if (user.resetTokenExpiry.getTime() < Date.now()) {
    throw AppError.BadRequest("Invalid or expired code");
  }

  const codeMatches = await bcrypt.compare(code, user.resetToken);

  if (!codeMatches) {
    throw AppError.BadRequest("Invalid or expired code");
  }

  const passwordHash = await bcrypt.hash(newPassword, getSaltRounds());

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });
}

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  forgotPassword,
  resetPassword,
};
