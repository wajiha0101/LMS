const { z } = require("zod");

const courseIdParamsSchema = z.object({ id: z.string().uuid() });

const createAnnouncementBodySchema = z.object({
  title: z.string().min(3).max(200),
  message: z.string().min(1).max(5000),
});

module.exports = { courseIdParamsSchema, createAnnouncementBodySchema };