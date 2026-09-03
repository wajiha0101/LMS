const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { listUsersQuerySchema, updateProfileSchema } = require("./users.schema");
const {
  listUsersController,
  approveUserController,
  rejectUserController,
  removeUserController,
  getOwnProfileController,
  getUserByIdController,
  updateOwnProfileController,
} = require("./users.controller");

const usersRouter = Router();

usersRouter.get(
  "/users",
  authMiddleware,
  requireRole("ADMIN"),
  validate(listUsersQuerySchema, "query"),
  listUsersController
);
usersRouter.patch(
  "/users/:id/approve",
  authMiddleware,
  requireRole("ADMIN"),
  approveUserController
);
usersRouter.patch(
  "/users/:id/reject",
  authMiddleware,
  requireRole("ADMIN"),
  rejectUserController
);
usersRouter.delete(
  "/users/:id",
  authMiddleware,
  requireRole("ADMIN"),
  removeUserController
);
usersRouter.get("/users/me/profile", authMiddleware, getOwnProfileController);
usersRouter.patch(
  "/users/me/profile",
  authMiddleware,
  validate(updateProfileSchema),
  updateOwnProfileController
);
usersRouter.get("/users/:id", authMiddleware, getUserByIdController);

module.exports = usersRouter;
