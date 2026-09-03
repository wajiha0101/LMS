const { z } = require("zod");

const listUsersQuerySchema = z.object({
  role: z.enum(["ADMIN", "INSTRUCTOR", "STUDENT"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "PENDING", "REJECTED"]).optional(),
});

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  avatarUrl: z.string().trim().url("Avatar url is invalid").optional(),
  bio: z.string().trim().max(1000, "Bio must be at most 1000 characters").optional(),
  expertise: z.string().trim().max(255, "Expertise must be at most 255 characters").optional(),
  credentials: z.string().trim().max(255, "Credentials must be at most 255 characters").optional(),
});

module.exports = { listUsersQuerySchema, updateProfileSchema };
