const { Router } = require("express");
const paymentsController = require("./payments.controller");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");

const router = Router();

router.post("/checkout", authMiddleware, requireRole("STUDENT"), paymentsController.checkout);

module.exports = router;
module.exports.stripeWebhookHandler = paymentsController.stripeWebhook;