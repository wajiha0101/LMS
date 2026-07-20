const { Router } = require("express");
const enrollmentsController = require("./enrollments.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");

const router = Router();

router.get("/enrollments", authMiddleware, requireRole("STUDENT"), enrollmentsController.getMyEnrollments);

module.exports = router;