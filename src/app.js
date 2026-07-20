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
const reviewsRouter = require("./modules/reviews/reviews.routes");
const certificatesRouter = require("./modules/certificates/certificates.routes");
const payoutsRouter = require("./modules/payouts/payouts.routes");
const cartRouter = require("./modules/cart/cart.routes");

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

app.use("/auth", authRouter);
app.use("/", usersRouter);
app.use("/", coursesRouter);
app.use("/", materialsRouter);
app.use("/", quizzesRouter);
app.use("/", assignmentsRouter);
app.use("/", reviewsRouter);
app.use("/", certificatesRouter);
app.use("/", payoutsRouter);
app.use("/", cartRouter);

app.use((req, _res, next) => {
  console.log("UNMATCHED REQUEST:", req.method, req.originalUrl);
  next(AppError.NotFound("Route not found"));
});

app.use(errorMiddleware);

module.exports = app;
