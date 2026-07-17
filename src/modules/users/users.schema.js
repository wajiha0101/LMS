const { z } = require("zod");

const updateProfileSchema = z.object({
  bio: z.string().trim().max(1000, "Bio must be at most 1000 characters").optional(),
  expertise: z.string().trim().max(255, "Expertise must be at most 255 characters").optional(),
  credentials: z.string().trim().max(255, "Credentials must be at most 255 characters").optional(),
});

module.exports = { updateProfileSchema };
