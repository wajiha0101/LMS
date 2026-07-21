const { Router } = require("express");
const analyticsController = require("./analytics.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");

const router = Router();

router.get("/admin/analytics", authMiddleware, requireRole("ADMIN"), analyticsController.getAdminAnalytics);
router.get(
  "/instructors/me/analytics",
  authMiddleware,
  requireRole("INSTRUCTOR"),
  analyticsController.getInstructorAnalytics
);

module.exports = router;