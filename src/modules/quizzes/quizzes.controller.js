const { sendSuccess } = require("../../utils/ApiResponse");
const {
  createQuiz,
  updateQuiz,
  getQuizById,
  submitQuizAttempt,
  listQuizAttempts,
} = require("./quizzes.service");

async function createQuizController(req, res, next) {
  try {
    const quiz = await createQuiz(req.params.id, req.user.id, req.body);
    sendSuccess(res, quiz, 201);
  } catch (error) {
    next(error);
  }
}

async function updateQuizController(req, res, next) {
  try {
    const quiz = await updateQuiz(req.params.id, req.user.id, req.body);
    sendSuccess(res, quiz);
  } catch (error) {
    next(error);
  }
}

async function getQuizByIdController(req, res, next) {
  try {
    const quiz = await getQuizById(req.params.id, req.user);
    sendSuccess(res, quiz);
  } catch (error) {
    next(error);
  }
}

async function submitQuizAttemptController(req, res, next) {
  try {
    const attempt = await submitQuizAttempt(req.params.id, req.user.id, req.body);
    sendSuccess(res, attempt, 201);
  } catch (error) {
    next(error);
  }
}

async function listQuizAttemptsController(req, res, next) {
  try {
    const attempts = await listQuizAttempts(req.params.id, req.user.id);
    sendSuccess(res, attempts);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createQuizController,
  updateQuizController,
  getQuizByIdController,
  submitQuizAttemptController,
  listQuizAttemptsController,
};
