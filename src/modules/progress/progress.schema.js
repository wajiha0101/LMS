const { z } = require("zod");

const materialIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const courseIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const updateProgressBodySchema = z.object({
  completed: z.boolean().optional(),
  resumePosition: z.number().int().nonnegative().optional(),
});

module.exports = { materialIdParamsSchema, courseIdParamsSchema, updateProgressBodySchema };