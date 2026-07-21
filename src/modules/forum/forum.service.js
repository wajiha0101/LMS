const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");
const { assertCourseAccess } = require("./forum.access");

async function getThreads(user, courseId) {
  await assertCourseAccess(user, courseId);
  return prisma.forumThread.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
  });
}

async function createThread(user, courseId, title) {
  await assertCourseAccess(user, courseId);
  return prisma.forumThread.create({
    data: { courseId, title, createdBy: user.id },
  });
}

async function getThreadWithPosts(user, threadId) {
  const thread = await prisma.forumThread.findUnique({ where: { id: threadId } });
  if (!thread) {
    throw AppError.NotFound("Thread not found");
  }
  await assertCourseAccess(user, thread.courseId);

  const posts = await prisma.forumPost.findMany({
    where: { threadId },
    include: { author: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });

  return { thread, posts };
}

async function addPost(user, threadId, message) {
  const thread = await prisma.forumThread.findUnique({ where: { id: threadId } });
  if (!thread) {
    throw AppError.NotFound("Thread not found");
  }
  await assertCourseAccess(user, thread.courseId);

  return prisma.forumPost.create({
    data: { threadId, authorId: user.id, message },
  });
}

module.exports = { getThreads, createThread, getThreadWithPosts, addPost };