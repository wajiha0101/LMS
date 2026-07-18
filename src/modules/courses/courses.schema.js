const { z } = require("zod");

const createCourseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  price: z.number().nonnegative("Price must be zero or greater"),
  categoryId: z.string().uuid("Category id must be a valid uuid"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    errorMap: () => ({ message: "Level must be BEGINNER, INTERMEDIATE or ADVANCED" }),
  }),
  thumbnailUrl: z.string().trim().url("Thumbnail url is invalid").optional(),
});

const updateCourseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().trim().min(10, "Description must be at least 10 characters").optional(),
  price: z.number().nonnegative("Price must be zero or greater").optional(),
  categoryId: z.string().uuid("Category id must be a valid uuid").optional(),
  level: z
    .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
      errorMap: () => ({ message: "Level must be BEGINNER, INTERMEDIATE or ADVANCED" }),
    })
    .optional(),
  thumbnailUrl: z.string().trim().url("Thumbnail url is invalid").optional(),
});

const listCoursesQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().uuid("Category must be a valid uuid").optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sort: z.enum(["newest", "priceAsc", "priceDesc"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const adminCoursesQuerySchema = z.object({
  status: z.enum(["DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "PUBLISHED", "ARCHIVED"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

const updateCategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  listCoursesQuerySchema,
  adminCoursesQuerySchema,
  createCategorySchema,
  updateCategorySchema,
};

