const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { updateProfileSchema } = require("./users.schema");
const {listInstructorsController,approveInstructorController,rejectInstructorController,removeInstructorController,
  listStudentsController,
  suspendStudentController,
  removeStudentController,
  getInstructorPublicProfileController,
  updateOwnInstructorProfileController,
} = require("./users.controller");

const adminUsersRouter = Router();

adminUsersRouter.get("/admin/instructors",authMiddleware,requireRole("ADMIN"),
listInstructorsController
);
adminUsersRouter.patch("/admin/instructors/:id/approve",authMiddleware,requireRole("ADMIN"),
  approveInstructorController
);
adminUsersRouter.patch("/admin/instructors/:id/reject",authMiddleware,requireRole("ADMIN"),
rejectInstructorController
);
adminUsersRouter.delete("/admin/instructors/:id",authMiddleware,requireRole("ADMIN"),
  removeInstructorController
);
adminUsersRouter.get("/admin/students",authMiddleware,requireRole("ADMIN"),
  listStudentsController
);
adminUsersRouter.patch("/admin/students/:id/suspend",authMiddleware,requireRole("ADMIN"),
  suspendStudentController
);
adminUsersRouter.delete("/admin/students/:id",authMiddleware,requireRole("ADMIN"),
  removeStudentController
);

adminUsersRouter.get("/instructors/:id", getInstructorPublicProfileController);
adminUsersRouter.patch("/instructors/me/profile",authMiddleware,requireRole("INSTRUCTOR"),
  validate(updateProfileSchema),
  updateOwnInstructorProfileController
);

module.exports = adminUsersRouter;
