const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");
const { assertCourseAccess } = require("../forum/forum.access");

async function createAnnouncement(instructorId, courseId, title, message) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.instructorId !== instructorId) {
    throw AppError.Forbidden("You do not own this course");
  }

  return prisma.announcement.create({
    data: { courseId, instructorId, title, message },
  });
}

async function getAnnouncements(user, courseId) {
  await assertCourseAccess(user, courseId);
  return prisma.announcement.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = { createAnnouncement, getAnnouncements };