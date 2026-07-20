const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");

async function getMyNotifications(userId) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function markAsRead(userId, notificationId) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification || notification.userId !== userId) {
    throw AppError.NotFound("Notification not found");
  }
  return prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
}

// Helper other modules can call (e.g. Payments on successful checkout,
// Reviews/Announcements from Person A's side) to create a notification.
// Exported so it can be required from anywhere without duplicating logic.
async function createNotification(userId, type, message) {
  return prisma.notification.create({
    data: { userId, type, message },
  });
}

module.exports = { getMyNotifications, markAsRead, createNotification };