const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const {createAssignmentSchema,updateAssignmentSchema,submitAssignmentSchema,gradeSubmissionSchema,
} = require("./assignments.schema");
const {createAssignmentController,updateAssignmentController,submitAssignmentController,gradeSubmissionController,
} = require("./assignments.controller");

const assignmentsRouter = Router();

assignmentsRouter.post("/courses/:id/assignment",authMiddleware,requireRole("INSTRUCTOR"),validate(createAssignmentSchema),
  createAssignmentController
);
assignmentsRouter.patch("/assignments/:id",authMiddleware,requireRole("INSTRUCTOR"),validate(updateAssignmentSchema),
  updateAssignmentController
);
assignmentsRouter.post("/assignments/:id/submissions",authMiddleware,requireRole("STUDENT"),validate(submitAssignmentSchema),
  submitAssignmentController
);
assignmentsRouter.patch("/submissions/:id/grade",authMiddleware,requireRole("INSTRUCTOR"),validate(gradeSubmissionSchema),
  gradeSubmissionController
);

module.exports = assignmentsRouter;
