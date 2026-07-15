const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { AuthMiddleware } = require("../../middlewares/auth.middleware");
const { Validate } = require("../../middlewares/validate.middleware");
const { RegisterSchema, LoginSchema } = require("./auth.schema");
const {
  RegisterController,
  LoginController,
  RefreshController,
  LogoutController,
  MeController,
} = require("./auth.controller");

const AuthRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const AuthRouter = Router();

AuthRouter.post("/register", AuthRateLimiter, Validate(RegisterSchema), RegisterController);
AuthRouter.post("/login", AuthRateLimiter, Validate(LoginSchema), LoginController);
AuthRouter.post("/refresh", AuthRateLimiter, RefreshController);
AuthRouter.post("/logout", AuthMiddleware, LogoutController);
AuthRouter.get("/me", AuthMiddleware, MeController);

module.exports = AuthRouter;
