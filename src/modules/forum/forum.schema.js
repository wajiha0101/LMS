const { z } = require("zod");

const courseIdParamsSchema = z.object({ id: z.string().uuid() });
const threadIdParamsSchema = z.object({ id: z.string().uuid() });

const createThreadBodySchema = z.object({
  title: z.string().min(3).max(200),
});

const createPostBodySchema = z.object({
  message: z.string().min(1).max(5000),
});

module.exports = {
  courseIdParamsSchema,
  threadIdParamsSchema,
  createThreadBodySchema,
  createPostBodySchema,
};