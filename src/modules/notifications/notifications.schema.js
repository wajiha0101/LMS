const { z } = require("zod");

const notificationIdParamsSchema = z.object({
  id: z.string().uuid(),
});

module.exports = { notificationIdParamsSchema };