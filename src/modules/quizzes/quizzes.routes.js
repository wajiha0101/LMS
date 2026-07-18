const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { createQuizSchema, updateQuizSchema, submitQuizAttemptSchema } = require("./quizzes.schema");
const {createQuizController,updateQuizController,getQuizByIdController,submitQuizAttemptController,
  listQuizAttemptsController,
} = require("./quizzes.controller");

const quizzesRouter = Router();

quizzesRouter.post("/courses/:id/quiz",authMiddleware,requireRole("INSTRUCTOR"),validate(createQuizSchema),
  createQuizController
);
quizzesRouter.patch("/quizzes/:id",authMiddleware,requireRole("INSTRUCTOR"),validate(updateQuizSchema),
  updateQuizController
);
quizzesRouter.get("/quizzes/:id",authMiddleware,requireRole("INSTRUCTOR", "STUDENT"),
  getQuizByIdController
);
quizzesRouter.post("/quizzes/:id/attempts",authMiddleware,requireRole("STUDENT"),validate(submitQuizAttemptSchema),
  submitQuizAttemptController
);
quizzesRouter.get("/quizzes/:id/attempts",authMiddleware,requireRole("INSTRUCTOR"),
  listQuizAttemptsController
);

module.exports = quizzesRouter;
