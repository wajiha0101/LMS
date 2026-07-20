const { Router } = require("express");
const announcementsController = require("./announcements.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { courseIdParamsSchema, createAnnouncementBodySchema } = require("./announcements.schema");

const router = Router();

router.post(
  "/courses/:id/announcements",
  authMiddleware,
  requireRole("INSTRUCTOR"),
  validate(courseIdParamsSchema, "params"),
  validate(createAnnouncementBodySchema, "body"),
  announcementsController.createAnnouncement
);

router.get(
  "/courses/:id/announcements",
  authMiddleware,
  validate(courseIdParamsSchema, "params"),
  announcementsController.getAnnouncements
);

module.exports = router;