const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");
const enrollmentsService = require("../enrollments/enrollments.service");

async function recalculateEnrollmentProgress(studentId, courseId) {
  const totalMaterials = await prisma.material.count({ where: { courseId } });
  const completedCount = await prisma.lessonProgress.count({
    where: { studentId, completed: true, material: { courseId } },
  });
  const progressPercent = totalMaterials === 0 ? 0 : (completedCount / totalMaterials) * 100;

  await prisma.enrollment.update({
    where: { studentId_courseId: { studentId, courseId } },
    data: {
      progressPercent,
      completedAt: progressPercent === 100 ? new Date() : null,
      status: progressPercent === 100 ? "COMPLETED" : "ACTIVE",
    },
  });

  return progressPercent;
}

async function updateMaterialProgress(studentId, materialId, { completed, resumePosition }) {
  const material = await prisma.material.findUnique({ where: { id: materialId } });
  if (!material) {
    throw AppError.NotFound("Material not found");
  }

  const enrolled = await enrollmentsService.isEnrolled(studentId, material.courseId);
  if (!enrolled) {
    throw AppError.Forbidden("You must be enrolled in this course to track progress");
  }

  const data = {};
  if (completed !== undefined) {
    data.completed = completed;
    data.completedAt = completed ? new Date() : null;
  }
  if (resumePosition !== undefined) {
    data.resumePosition = resumePosition;
  }

  const lessonProgress = await prisma.lessonProgress.upsert({
    where: { studentId_materialId: { studentId, materialId } },
    update: data,
    create: {
      studentId,
      materialId,
      completed: completed ?? false,
      resumePosition: resumePosition ?? 0,
      completedAt: completed ? new Date() : null,
    },
  });

  const progressPercent = await recalculateEnrollmentProgress(studentId, material.courseId);

  return { lessonProgress, progressPercent };
}

async function getCourseProgress(studentId, courseId) {
  const enrolled = await enrollmentsService.isEnrolled(studentId, courseId);
  if (!enrolled) {
    throw AppError.Forbidden("You must be enrolled in this course to view progress");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
  });

  const lessonProgress = await prisma.lessonProgress.findMany({
    where: { studentId, material: { courseId } },
    include: { material: { select: { id: true, title: true, type: true, position: true } } },
    orderBy: { material: { position: "asc" } },
  });

  return { progressPercent: enrollment.progressPercent, lessons: lessonProgress };
}

module.exports = { updateMaterialProgress, getCourseProgress, recalculateEnrollmentProgress };