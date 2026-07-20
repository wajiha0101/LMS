const { prisma } = require("../../lib/prisma");

async function getMyEnrollments(studentId) {
  return prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        select: { id: true, title: true, thumbnailUrl: true, price: true },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });
}

async function isEnrolled(studentId, courseId) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
  });
  return !!enrollment && enrollment.status !== "REFUNDED";
}

module.exports = { getMyEnrollments, isEnrolled };