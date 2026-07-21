const { Router } = require("express");
const wishlistController = require("./wishlist.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { courseIdParamsSchema } = require("./wishlist.schema");

const router = Router();

router.use("/wishlist", authMiddleware, requireRole("STUDENT"));

router.get("/wishlist", wishlistController.getWishlist);
router.post("/wishlist/:courseId", validate(courseIdParamsSchema, "params"), wishlistController.addToWishlist);
router.delete("/wishlist/:courseId", validate(courseIdParamsSchema, "params"), wishlistController.removeFromWishlist);

module.exports = router;