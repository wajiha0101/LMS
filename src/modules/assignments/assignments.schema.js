const { z } = require("zod");

const createAssignmentSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  dueDate: z.string().datetime("Due date must be a valid datetime").optional(),
});

const updateAssignmentSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").optional(),
  description: z.string().trim().min(10, "Description must be at least 10 characters").optional(),
  dueDate: z.string().datetime("Due date must be a valid datetime").optional(),
});

const submitAssignmentSchema = z.object({
  fileUrl: z.string().trim().url("File url is invalid"),
});

const gradeSubmissionSchema = z.object({
  grade: z.number().nonnegative("Grade must be zero or greater"),
  feedback: z.string().trim().max(2000, "Feedback must be at most 2000 characters").optional(),
});

module.exports = {
  createAssignmentSchema,
  updateAssignmentSchema,
  submitAssignmentSchema,
  gradeSubmissionSchema,
};
