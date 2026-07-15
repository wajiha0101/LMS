const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ErrorMiddleware } = require("./middlewares/error.middleware");
const { AppError } = require("./utils/AppError");
const AuthRouter = require("./modules/auth/auth.routes");

const App = express();

App.use(helmet());
App.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
App.use(express.json());
App.use(cookieParser());

App.get("/health", (_req, res) => {
  res.status(200).json({ success: true, data: { Status: "ok" } });
});

App.use("/api/v1/auth", AuthRouter);

App.use((_req, _res, next) => {
  next(AppError.NotFound("Route not found"));
});

App.use(ErrorMiddleware);

module.exports = App;
