const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { listOwnPayoutsController, listAllPayoutsController } = require("./payouts.controller");

const payoutsRouter = Router();

payoutsRouter.get(
  "/instructors/me/payouts",
  authMiddleware,
  requireRole("INSTRUCTOR"),
  listOwnPayoutsController
);
payoutsRouter.get(
  "/admin/payouts",
  authMiddleware,
  requireRole("ADMIN"),
  listAllPayoutsController
);

module.exports = payoutsRouter;
