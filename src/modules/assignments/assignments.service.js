const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");

function sanitizeAssignment(assignment) {
  return {
    id: assignment.id,
    courseId: assignment.courseId,
    title: assignment.title,
    description: assignment.description,
    dueDate: assignment.dueDate,
  };
}

function sanitizeSubmission(submission) {
  return {
    id: submission.id,
    assignmentId: submission.assignmentId,
    courseId: submission.courseId,
    studentId: submission.studentId,
    fileUrl: submission.fileUrl,
    grade: submission.grade,
    feedback: submission.feedback,
    submittedAt: submission.submittedAt,
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

async function createAssignment(courseId, instructorId, input) {
  await getOwnedCourseOrFail(courseId, instructorId);

  const existingAssignment = await prisma.assignment.findUnique({ where: { courseId: courseId } });

  if (existingAssignment) {
    throw AppError.Conflict("This course already has an assignment");
  }

  const createdAssignment = await prisma.assignment.create({
    data: {
      courseId: courseId,
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
    },
  });

  return sanitizeAssignment(createdAssignment);
}

async function updateAssignment(assignmentId, instructorId, input) {
  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });

  if (!assignment) {
    throw AppError.NotFound("Assignment not found");
  }

  await getOwnedCourseOrFail(assignment.courseId, instructorId);

  const updatedAssignment = await prisma.assignment.update({
    where: { id: assignmentId },
    data: input,
  });

  return sanitizeAssignment(updatedAssignment);
}

async function submitAssignment(assignmentId, studentId, input) {
  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });

  if (!assignment) {
    throw AppError.NotFound("Assignment not found");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { courseId: assignment.courseId, studentId: studentId },
  });

  if (!enrollment) {
    throw AppError.Forbidden("You must be enrolled in this course to submit its assignment");
  }

  const existingSubmission = await prisma.assignmentSubmission.findUnique({
    where: { studentId_assignmentId: { studentId: studentId, assignmentId: assignmentId } },
  });

  if (existingSubmission) {
    throw AppError.Conflict("You have already submitted this assignment");
  }

  const createdSubmission = await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignmentId,
      courseId: assignment.courseId,
      studentId: studentId,
      fileUrl: input.fileUrl,
    },
  });

  return sanitizeSubmission(createdSubmission);
}

async function gradeSubmission(submissionId, instructorId, input) {
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: { assignment: true },
  });

  if (!submission) {
    throw AppError.NotFound("Submission not found");
  }

  await getOwnedCourseOrFail(submission.assignment.courseId, instructorId);

  const updatedSubmission = await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: { grade: input.grade, feedback: input.feedback },
  });

  return sanitizeSubmission(updatedSubmission);
}

module.exports = {
  createAssignment,
  updateAssignment,
  submitAssignment,
  gradeSubmission,
};
