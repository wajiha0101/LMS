const { Router } = require("express");
const notificationsController = require("./notifications.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { notificationIdParamsSchema } = require("./notifications.schema");

const router = Router();

router.use("/notifications", authMiddleware);

router.get("/notifications", notificationsController.getMyNotifications);
router.patch(
  "/notifications/:id/read",
  validate(notificationIdParamsSchema, "params"),
  notificationsController.markAsRead
);

module.exports = router;