const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("./auth.schema");
const {
  registerController,
  loginController,
  refreshController,
  logoutController,
} = require("./auth.controller");

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const authRouter = Router();

authRouter.post("/register", authRateLimiter, validate(registerSchema), registerController);
authRouter.post("/login", authRateLimiter, validate(loginSchema), loginController);
authRouter.post("/refresh", authRateLimiter, refreshController);
authRouter.post("/logout", authMiddleware, logoutController);

module.exports = authRouter;
