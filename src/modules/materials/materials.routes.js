const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRole } = require("../../middlewares/rbac.middleware");
const { validate } = require("../../middlewares/validate.middleware");
const { uploadMaterialFile } = require("./materials.upload");
const { createMaterialSchema, updateMaterialSchema } = require("./materials.schema");
const {createMaterialController,updateMaterialController,deleteMaterialController,listMaterialsController,
} = require("./materials.controller");

const materialsRouter = Router();

materialsRouter.post("/courses/:id/materials",authMiddleware,requireRole("INSTRUCTOR"),uploadMaterialFile,validate(createMaterialSchema),
  createMaterialController
);
materialsRouter.get("/courses/:id/materials",authMiddleware,requireRole("INSTRUCTOR", "STUDENT"),
  listMaterialsController
);
materialsRouter.patch("/materials/:id",authMiddleware,requireRole("INSTRUCTOR"),uploadMaterialFile,validate(updateMaterialSchema),
  updateMaterialController
);
materialsRouter.delete("/materials/:id",authMiddleware,requireRole("INSTRUCTOR"),
  deleteMaterialController
);

module.exports = materialsRouter;
