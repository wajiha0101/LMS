const { z } = require("zod");

const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().trim().max(2000, "Comment must be at most 2000 characters").optional(),
});

module.exports = { createReviewSchema };
