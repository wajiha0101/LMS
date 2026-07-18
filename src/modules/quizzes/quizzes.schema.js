const { z } = require("zod");

const quizQuestionSchema = z.object({
  questionText: z.string().trim().min(2, "Question text must be at least 2 characters"),
  options: z.array(z.string().trim().min(1)).min(2, "At least 2 options are required"),
  correctAnswer: z.string().trim().min(1, "Correct answer is required"),
  position: z.number().int().nonnegative("Position must be zero or greater"),
});

const createQuizSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  questions: z.array(quizQuestionSchema).min(1, "At least 1 question is required"),
});

const updateQuizSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").optional(),
});

const submitQuizAttemptSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid("Question id must be a valid uuid"),
        answer: z.string().trim().min(1, "Answer is required"),
      })
    )
    .min(1, "At least 1 answer is required"),
});

module.exports = {
  createQuizSchema,
  updateQuizSchema,
  submitQuizAttemptSchema,
};
