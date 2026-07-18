const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { createReviewSchema } = require("./reviews.schema");
const { createReviewController, listReviewsController } = require("./reviews.controller");

const reviewsRouter = Router();

reviewsRouter.post(
  "/courses/:id/reviews",
  authMiddleware,
  requireRole("STUDENT"),
  validate(createReviewSchema),
  createReviewController
);
reviewsRouter.get("/courses/:id/reviews", listReviewsController);

module.exports = reviewsRouter;
