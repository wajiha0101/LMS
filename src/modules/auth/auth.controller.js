const { SendSuccess } = require("../../utils/ApiResponse");
const { AppError } = require("../../utils/AppError");
const { GetRefreshCookieMaxAgeMs } = require("../../lib/jwt");
const { RegisterUser, LoginUser, RefreshSession, GetCurrentUser } = require("./auth.service");

const RefreshCookieName = "refreshToken";
const RefreshCookiePath = "/api/v1/auth";

function GetRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: RefreshCookiePath,
    maxAge: GetRefreshCookieMaxAgeMs(),
  };
}

async function RegisterController(req, res, next) {
  try {
    const CreatedUser = await RegisterUser(req.body);
    SendSuccess(res, CreatedUser, 201);
  } catch (Error) {
    next(Error);
  }
}

async function LoginController(req, res, next) {
  try {
    const Result = await LoginUser(req.body);
    res.cookie(RefreshCookieName, Result.RefreshToken, GetRefreshCookieOptions());
    SendSuccess(res, { User: Result.User, AccessToken: Result.AccessToken });
  } catch (Error) {
    next(Error);
  }
}

async function RefreshController(req, res, next) {
  try {
    const IncomingRefreshToken = req.cookies?.[RefreshCookieName];
    const Result = await RefreshSession(IncomingRefreshToken);
    res.cookie(RefreshCookieName, Result.RefreshToken, GetRefreshCookieOptions());
    SendSuccess(res, { User: Result.User, AccessToken: Result.AccessToken });
  } catch (Error) {
    next(Error);
  }
}

async function LogoutController(_req, res, next) {
  try {
    res.clearCookie(RefreshCookieName, { path: RefreshCookiePath });
    SendSuccess(res, { Message: "Logged out successfully" });
  } catch (Error) {
    next(Error);
  }
}

async function MeController(req, res, next) {
  try {
    if (!req.user) {
      throw AppError.Unauthorized();
    }
    const CurrentUser = await GetCurrentUser(req.user.Id);
    SendSuccess(res, CurrentUser);
  } catch (Error) {
    next(Error);
  }
}

module.exports = {
  RegisterController,
  LoginController,
  RefreshController,
  LogoutController,
  MeController,
};
