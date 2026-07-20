const { z } = require("zod");

const courseIdParamsSchema = z.object({
  courseId: z.string().uuid(),
});

module.exports = { courseIdParamsSchema };