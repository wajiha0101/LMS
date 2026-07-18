const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");

function sanitizeReview(review) {
  return {
    id: review.id,
    studentId: review.studentId,
    courseId: review.courseId,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
  };
}

async function createReview(courseId, studentId, input) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { courseId: courseId, studentId: studentId },
  });

  if (!enrollment) {
    throw AppError.Forbidden("You must be enrolled in this course to review it");
  }

  const existingReview = await prisma.review.findUnique({
    where: { studentId_courseId: { studentId: studentId, courseId: courseId } },
  });

  if (existingReview) {
    throw AppError.Conflict("You have already reviewed this course");
  }

  const createdReview = await prisma.review.create({
    data: {
      courseId: courseId,
      studentId: studentId,
      rating: input.rating,
      comment: input.comment,
    },
  });

  return sanitizeReview(createdReview);
}

async function listReviews(courseId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  const reviews = await prisma.review.findMany({
    where: { courseId: courseId },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map(sanitizeReview);
}

module.exports = { createReview, listReviews };
