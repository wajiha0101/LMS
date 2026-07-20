const { prisma } = require("../../lib/prisma"); // confirm exact export name/path once you check lib/prisma.js
const { AppError } = require("../../utils/AppError");

async function getCart(studentId) {
  const items = await prisma.cartItem.findMany({
    where: { studentId },
    include: {
      course: {
        select: { id: true, title: true, price: true, thumbnailUrl: true, instructorId: true },
      },
    },
    orderBy: { addedAt: "desc" },
  });

  const total = items.reduce((sum, item) => sum + Number(item.course.price), 0);
  return { items, total };
}

async function addItem(studentId, courseId) {
  return prisma.cartItem.upsert({
    where: { studentId_courseId: { studentId, courseId } },
    update: {},
    create: { studentId, courseId },
  });
}

async function removeItem(studentId, cartItemId) {
  const item = await prisma.cartItem.findUnique({ where: { id: cartItemId } });
  if (!item || item.studentId !== studentId) {
    throw AppError.NotFound("Cart item not found");
  }
  return prisma.cartItem.delete({ where: { id: cartItemId } });
}

module.exports = { getCart, addItem, removeItem };