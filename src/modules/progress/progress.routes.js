const { Router } = require("express");
const progressController = require("./progress.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const {
  materialIdParamsSchema,
  courseIdParamsSchema,
  updateProgressBodySchema,
} = require("./progress.schema");

const router = Router();

router.post(
  "/materials/:id/progress",
  authMiddleware,
  requireRole("STUDENT"),
  validate(materialIdParamsSchema, "params"),
  validate(updateProgressBodySchema, "body"),
  progressController.updateMaterialProgress
);

router.get(
  "/courses/:id/progress",
  authMiddleware,
  requireRole("STUDENT"),
  validate(courseIdParamsSchema, "params"),
  progressController.getCourseProgress
);

module.exports = router;