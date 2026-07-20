const { z } = require("zod");

const addCartItemBodySchema = z.object({
  courseId: z.string().uuid(),
});

const cartItemParamsSchema = z.object({
  id: z.string().uuid(),
});

module.exports = { addCartItemBodySchema, cartItemParamsSchema };