const bcrypt = require("bcrypt");
const { Prisma } = require("../../lib/prisma");
const { SignAccessToken, SignRefreshToken, VerifyRefreshToken } = require("../../lib/jwt");
const { AppError } = require("../../utils/AppError");

function SanitizeUser(User) {
  return {
    Id: User.id,
    Name: User.name,
    Email: User.email,
    Role: User.role,
    Status: User.status,
    AvatarUrl: User.avatarUrl,
    CreatedAt: User.createdAt,
  };
}

function GetSaltRounds() {
  const Rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "12", 10);
  return Number.isNaN(Rounds) ? 12 : Rounds;
}

async function RegisterUser(Input) {
  const ExistingUser = await Prisma.user.findUnique({ where: { email: Input.email } });

  if (ExistingUser) {
    throw AppError.Conflict("An account with this email already exists");
  }

  const PasswordHash = await bcrypt.hash(Input.password, GetSaltRounds());

  const CreatedUser = await Prisma.user.create({
    data: {
      name: Input.name,
      email: Input.email,
      passwordHash: PasswordHash,
      role: Input.role,
      status: Input.role === "INSTRUCTOR" ? "PENDING" : "ACTIVE",
      ...(Input.role === "INSTRUCTOR" ? { instructorProfile: { create: {} } } : {}),
    },
  });

  return SanitizeUser(CreatedUser);
}

async function LoginUser(Input) {
  const User = await Prisma.user.findUnique({ where: { email: Input.email } });

  if (!User) {
    throw AppError.Unauthorized("Invalid email or password");
  }

  if (User.status === "SUSPENDED") {
    throw AppError.Forbidden("This account has been suspended");
  }

  const PasswordMatches = await bcrypt.compare(Input.password, User.passwordHash);

  if (!PasswordMatches) {
    throw AppError.Unauthorized("Invalid email or password");
  }

  const TokenPayload = { sub: User.id, role: User.role, status: User.status };
  const AccessToken = SignAccessToken(TokenPayload);
  const RefreshToken = SignRefreshToken(TokenPayload);

  return {
    User: SanitizeUser(User),
    AccessToken,
    RefreshToken,
  };
}

async function RefreshSession(RefreshTokenCookie) {
  if (!RefreshTokenCookie) {
    throw AppError.Unauthorized("Missing refresh token");
  }

  let Payload;
  try {
    Payload = VerifyRefreshToken(RefreshTokenCookie);
  } catch {
    throw AppError.Unauthorized("Invalid or expired refresh token");
  }

  const User = await Prisma.user.findUnique({ where: { id: Payload.sub } });

  if (!User) {
    throw AppError.Unauthorized("User no longer exists");
  }

  if (User.status === "SUSPENDED") {
    throw AppError.Forbidden("This account has been suspended");
  }

  const TokenPayload = { sub: User.id, role: User.role, status: User.status };
  const AccessToken = SignAccessToken(TokenPayload);
  const NewRefreshToken = SignRefreshToken(TokenPayload);

  return {
    User: SanitizeUser(User),
    AccessToken,
    RefreshToken: NewRefreshToken,
  };
}

async function GetCurrentUser(UserId) {
  const User = await Prisma.user.findUnique({ where: { id: UserId } });

  if (!User) {
    throw AppError.NotFound("User not found");
  }

  return SanitizeUser(User);
}

module.exports = { RegisterUser, LoginUser, RefreshSession, GetCurrentUser };
