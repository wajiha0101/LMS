const { Router } = require("express");
const { authMiddleware, optionalAuthMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const {createCourseSchema,updateCourseSchema,listCoursesQuerySchema,adminCoursesQuerySchema,
  createCategorySchema,
  updateCategorySchema,
} = require("./courses.schema");
const {listCategoriesController,createCategoryController,updateCategoryController,deleteCategoryController,listCoursesController,getCourseByIdController,createCourseController,updateCourseController,
  deleteCourseController,
  getCourseStudentsController,
  submitCourseForApprovalController,
  listCoursesForAdminController,
  approveCourseController,
  rejectCourseController,
} = require("./courses.controller");

const coursesRouter = Router();

coursesRouter.get("/categories", listCategoriesController);
coursesRouter.post("/admin/categories",authMiddleware,requireRole("ADMIN"),validate(createCategorySchema),
  createCategoryController
);
coursesRouter.patch("/admin/categories/:id",authMiddleware,requireRole("ADMIN"),validate(updateCategorySchema),
  updateCategoryController
);
coursesRouter.delete("/admin/categories/:id",authMiddleware,requireRole("ADMIN"),
  deleteCategoryController
);

coursesRouter.get("/admin/courses",authMiddleware,requireRole("ADMIN"),validate(adminCoursesQuerySchema, "query"),
listCoursesForAdminController
);
coursesRouter.patch("/admin/courses/:id/approve",authMiddleware,requireRole("ADMIN"),
  approveCourseController
);
coursesRouter.patch("/admin/courses/:id/reject",authMiddleware,requireRole("ADMIN"),
  rejectCourseController
);

coursesRouter.get("/courses",validate(listCoursesQuerySchema, "query"),listCoursesController);
coursesRouter.get("/courses/:id", optionalAuthMiddleware, getCourseByIdController);
coursesRouter.post("/courses",authMiddleware,requireRole("INSTRUCTOR"),validate(createCourseSchema),
  createCourseController
);
coursesRouter.patch("/courses/:id",authMiddleware,requireRole("INSTRUCTOR"),validate(updateCourseSchema),
  updateCourseController
);
coursesRouter.delete("/courses/:id",authMiddleware,requireRole("INSTRUCTOR", "ADMIN"),
deleteCourseController
);
coursesRouter.get("/courses/:id/students",authMiddleware,requireRole("INSTRUCTOR"),
  getCourseStudentsController
);
coursesRouter.post("/courses/:id/submit",authMiddleware,requireRole("INSTRUCTOR"),
  submitCourseForApprovalController
);

module.exports = coursesRouter;
