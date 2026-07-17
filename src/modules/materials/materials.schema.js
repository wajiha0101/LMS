const { z } = require("zod");

const createMaterialSchema = z.object({
  type: z.enum(["VIDEO", "PDF", "SLIDES", "QUIZ", "ASSIGNMENT", "RESOURCE"], {
    errorMap: () => ({
      message: "Type must be VIDEO, PDF, SLIDES, QUIZ, ASSIGNMENT or RESOURCE",
    }),
  }),
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  contentUrl: z.string().trim().url("Content url is invalid").optional(),
  duration: z.number().int().positive("Duration must be a positive number of seconds").optional(),
  position: z.number().int().nonnegative("Position must be zero or greater").optional(),
});

const updateMaterialSchema = z.object({
  type: z
    .enum(["VIDEO", "PDF", "SLIDES", "QUIZ", "ASSIGNMENT", "RESOURCE"], {
      errorMap: () => ({
        message: "Type must be VIDEO, PDF, SLIDES, QUIZ, ASSIGNMENT or RESOURCE",
      }),
    })
    .optional(),
  title: z.string().trim().min(2, "Title must be at least 2 characters").optional(),
  contentUrl: z.string().trim().url("Content url is invalid").optional(),
  duration: z.number().int().positive("Duration must be a positive number of seconds").optional(),
  position: z.number().int().nonnegative("Position must be zero or greater").optional(),
});

module.exports = { createMaterialSchema, updateMaterialSchema };
