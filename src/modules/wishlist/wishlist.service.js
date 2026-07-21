const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");

async function getWishlist(studentId) {
  return prisma.wishlist.findMany({
    where: { studentId },
    include: {
      course: {
        select: { id: true, title: true, price: true, thumbnailUrl: true },
      },
    },
    orderBy: { addedAt: "desc" },
  });
}

async function addToWishlist(studentId, courseId) {
  return prisma.wishlist.upsert({
    where: { studentId_courseId: { studentId, courseId } },
    update: {},
    create: { studentId, courseId },
  });
}

async function removeFromWishlist(studentId, courseId) {
  const entry = await prisma.wishlist.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
  });
  if (!entry) {
    throw AppError.NotFound("Course not in wishlist");
  }
  return prisma.wishlist.delete({
    where: { studentId_courseId: { studentId, courseId } },
  });
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };