const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const {
  listCertificatesController,
  getCourseCertificateController,
} = require("./certificates.controller");

const certificatesRouter = Router();

certificatesRouter.get(
  "/certificates",
  authMiddleware,
  requireRole("STUDENT"),
  listCertificatesController
);
certificatesRouter.get(
  "/courses/:id/certificate",
  authMiddleware,
  requireRole("STUDENT"),
  getCourseCertificateController
);

module.exports = certificatesRouter;
