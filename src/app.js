const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorMiddleware } = require("./middlewares/error.middleware");
const { AppError } = require("./utils/AppError");
const authRouter = require("./modules/auth/auth.routes");
const usersRouter = require("./modules/users/users.routes");
const coursesRouter = require("./modules/courses/courses.routes");
const materialsRouter = require("./modules/materials/materials.routes");
const quizzesRouter = require("./modules/quizzes/quizzes.routes");
const assignmentsRouter = require("./modules/assignments/assignments.routes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, data: { status: "ok" } });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", usersRouter);
app.use("/api/v1", coursesRouter);
app.use("/api/v1", materialsRouter);
app.use("/api/v1", quizzesRouter);
app.use("/api/v1", assignmentsRouter);

app.use((_req, _res, next) => {
  next(AppError.NotFound("Route not found"));
});

app.use(errorMiddleware);

module.exports = app;
