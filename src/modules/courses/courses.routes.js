const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const {createCourseSchema,updateCourseSchema,listCoursesQuerySchema,adminCoursesQuerySchema,
} = require("./courses.schema");
const {listCategoriesController,listCoursesController,getCourseByIdController,createCourseController,updateCourseController,
  deleteCourseController,
  getCourseStudentsController,
  submitCourseForApprovalController,
  listCoursesForAdminController,
  approveCourseController,
  rejectCourseController,
} = require("./courses.controller");

const coursesRouter = Router();

coursesRouter.get("/categories", listCategoriesController);

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
coursesRouter.get("/courses/:id", getCourseByIdController);
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
