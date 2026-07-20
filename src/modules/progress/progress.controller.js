const progressService = require("./progress.service");

async function updateMaterialProgress(req, res, next) {
  try {
    const studentId = req.user.id;
    const materialId = req.params.id;
    const result = await progressService.updateMaterialProgress(studentId, materialId, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getCourseProgress(req, res, next) {
  try {
    const studentId = req.user.id;
    const courseId = req.params.id;
    const result = await progressService.getCourseProgress(studentId, courseId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { updateMaterialProgress, getCourseProgress };