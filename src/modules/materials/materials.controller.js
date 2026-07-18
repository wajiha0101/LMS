const { sendSuccess } = require("../../utils/ApiResponse");
const {
  createMaterial,
  updateMaterial,
  deleteMaterial,
  listMaterials,
} = require("./materials.service");

async function createMaterialController(req, res, next) {
  try {
    const material = await createMaterial(req.params.id, req.user.id, req.body, req.file);
    sendSuccess(res, material, 201);
  } catch (error) {
    next(error);
  }
}

async function updateMaterialController(req, res, next) {
  try {
    const material = await updateMaterial(req.params.id, req.user.id, req.body, req.file);
    sendSuccess(res, material);
  } catch (error) {
    next(error);
  }
}

async function deleteMaterialController(req, res, next) {
  try {
    await deleteMaterial(req.params.id, req.user.id);
    sendSuccess(res, { message: "Material deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function listMaterialsController(req, res, next) {
  try {
    const materials = await listMaterials(req.params.id, req.user);
    sendSuccess(res, materials);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMaterialController,
  updateMaterialController,
  deleteMaterialController,
  listMaterialsController,
};
