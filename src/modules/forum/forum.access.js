const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");
const enrollmentsService = require("../enrollments/enrollments.service");

// Confirms the requesting user is either an enrolled student on the course,
// or the instructor who owns it. Throws Forbidden otherwise.
async function assertCourseAccess(user, courseId) {
  if (user.role === "STUDENT") {
    const enrolled = await enrollmentsService.isEnrolled(user.id, courseId);
    if (!enrolled) {
      throw AppError.Forbidden("You must be enrolled in this course");
    }
    return;
  }

  if (user.role === "INSTRUCTOR") {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.instructorId !== user.id) {
      throw AppError.Forbidden("You do not own this course");
    }
    return;
  }

  throw AppError.Forbidden("Not authorized for this course");
}

module.exports = { assertCourseAccess };