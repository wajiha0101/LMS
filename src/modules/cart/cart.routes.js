const { Router } = require("express");
const cartController = require("./cart.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { addCartItemBodySchema, cartItemParamsSchema } = require("./cart.schema");

const router = Router();

router.use("/cart", authMiddleware, requireRole("STUDENT"));

router.get("/cart", cartController.getCart);
router.post("/cart/items", validate(addCartItemBodySchema, "body"), cartController.addItem);
router.delete("/cart/items/:id", validate(cartItemParamsSchema, "params"), cartController.removeItem);

module.exports = router;