const { prisma } = require("../../lib/prisma");
const { uploadBuffer } = require("../../lib/cloudinary");
const { AppError } = require("../../utils/AppError");

function sanitizeMaterial(material) {
  return {
    id: material.id,
    courseId: material.courseId,
    type: material.type,
    title: material.title,
    contentUrl: material.contentUrl,
    position: material.position,
    duration: material.duration,
    createdAt: material.createdAt,
  };
}

function sanitizeMaterialPreview(material) {
  return {
    id: material.id,
    title: material.title,
    type: material.type,
    position: material.position,
  };
}

async function getOwnedCourseOrFail(courseId, instructorId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  if (course.instructorId !== instructorId) {
    throw AppError.Forbidden("You do not own this course");
  }

  return course;
}

async function uploadMaterialFile(file, materialType) {
  const resourceType = materialType === "VIDEO" ? "video" : "raw";
  const result = await uploadBuffer(file.buffer, { resource_type: resourceType });
  return result.secure_url;
}

async function createMaterial(courseId, instructorId, input, file) {
  await getOwnedCourseOrFail(courseId, instructorId);

  let position = input.position;
  if (position === undefined) {
    const lastMaterial = await prisma.material.findFirst({
      where: { courseId: courseId },
      orderBy: { position: "desc" },
    });
    position = lastMaterial ? lastMaterial.position + 1 : 0;
  }

  let contentUrl = input.contentUrl;
  if (file) {
    contentUrl = await uploadMaterialFile(file, input.type);
  }

  const createdMaterial = await prisma.material.create({
    data: {
      courseId: courseId,
      type: input.type,
      title: input.title,
      contentUrl: contentUrl,
      duration: input.duration,
      position: position,
    },
  });

  return sanitizeMaterial(createdMaterial);
}

async function updateMaterial(materialId, instructorId, input, file) {
  const material = await prisma.material.findUnique({ where: { id: materialId } });

  if (!material) {
    throw AppError.NotFound("Material not found");
  }

  await getOwnedCourseOrFail(material.courseId, instructorId);

  let contentUrl = input.contentUrl;
  if (file) {
    contentUrl = await uploadMaterialFile(file, input.type ?? material.type);
  }

  const updatedMaterial = await prisma.material.update({
    where: { id: materialId },
    data: { ...input, contentUrl: contentUrl },
  });

  return sanitizeMaterial(updatedMaterial);
}

async function deleteMaterial(materialId, instructorId) {
  const material = await prisma.material.findUnique({ where: { id: materialId } });

  if (!material) {
    throw AppError.NotFound("Material not found");
  }

  await getOwnedCourseOrFail(material.courseId, instructorId);

  await prisma.material.delete({ where: { id: materialId } });
}

async function listMaterials(courseId, requestingUser) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  const materials = await prisma.material.findMany({
    where: { courseId: courseId },
    orderBy: { position: "asc" },
  });

  const isOwningInstructor = course.instructorId === requestingUser.id;

  let hasFullAccess = isOwningInstructor;

  if (!hasFullAccess) {
    const enrollment = await prisma.enrollment.findFirst({
      where: { courseId: courseId, studentId: requestingUser.id },
    });
    hasFullAccess = Boolean(enrollment);
  }

  if (hasFullAccess) {
    return materials.map(sanitizeMaterial);
  }

  return materials.map(sanitizeMaterialPreview);
}

module.exports = {
  createMaterial,
  updateMaterial,
  deleteMaterial,
  listMaterials,
};
