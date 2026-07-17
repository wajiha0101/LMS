const { sendSuccess } = require("../../utils/ApiResponse");
const { getRefreshCookieMaxAgeMs } = require("../../lib/jwt");
const {
  registerUser,
  loginUser,
  refreshSession,
  forgotPassword,
  resetPassword,
} = require("./auth.service");

const refreshCookieName = "refreshToken";
const refreshCookiePath = "/auth";

function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: refreshCookiePath,
    maxAge: getRefreshCookieMaxAgeMs(),
  };
}

async function registerController(req, res, next) {
  try {
    const createdUser = await registerUser(req.body);
    sendSuccess(res, createdUser, 201);
  } catch (error) {
    next(error);
  }
}

async function loginController(req, res, next) {
  try {
    const result = await loginUser(req.body);
    res.cookie(refreshCookieName, result.refreshToken, getRefreshCookieOptions());
    sendSuccess(res, { user: result.user, accessToken: result.accessToken });
  } catch (error) {
    next(error);
  }
}

async function refreshController(req, res, next) {
  try {
    const incomingRefreshToken = req.cookies?.[refreshCookieName];
    const result = await refreshSession(incomingRefreshToken);
    res.cookie(refreshCookieName, result.refreshToken, getRefreshCookieOptions());
    sendSuccess(res, { user: result.user, accessToken: result.accessToken });
  } catch (error) {
    next(error);
  }
}

async function logoutController(_req, res, next) {
  try {
    res.clearCookie(refreshCookieName, { path: refreshCookiePath });
    sendSuccess(res, { message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

async function forgotPasswordController(req, res, next) {
  try {
    await forgotPassword(req.body.email);
    sendSuccess(res, {
      message: "If an account exists for this email, a reset code has been sent",
    });
  } catch (error) {
    next(error);
  }
}

async function resetPasswordController(req, res, next) {
  try {
    await resetPassword(req.body.email, req.body.code, req.body.newPassword);
    sendSuccess(res, { message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
};
