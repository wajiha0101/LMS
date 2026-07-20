const { Router } = require("express");
const forumController = require("./forum.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const {
  courseIdParamsSchema,
  threadIdParamsSchema,
  createThreadBodySchema,
  createPostBodySchema,
} = require("./forum.schema");

const router = Router();

router.use(authMiddleware); // both STUDENT and INSTRUCTOR allowed — access.js does the fine-grained check

router.get("/courses/:id/threads", validate(courseIdParamsSchema, "params"), forumController.getThreads);
router.post(
  "/courses/:id/threads",
  validate(courseIdParamsSchema, "params"),
  validate(createThreadBodySchema, "body"),
  forumController.createThread
);
router.get("/threads/:id", validate(threadIdParamsSchema, "params"), forumController.getThread);
router.post(
  "/threads/:id/posts",
  validate(threadIdParamsSchema, "params"),
  validate(createPostBodySchema, "body"),
  forumController.addPost
);

module.exports = router;