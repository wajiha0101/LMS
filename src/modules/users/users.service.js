const { prisma } = require("../../lib/prisma");
const { AppError } = require("../../utils/AppError");

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

function sanitizeInstructorProfile(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    bio: user.instructorProfile?.bio ?? null,
    expertise: user.instructorProfile?.expertise ?? null,
    credentials: user.instructorProfile?.credentials ?? null,
  };
}

async function listInstructors() {
  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    include: { instructorProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return instructors.map(sanitizeInstructorProfile);
}

async function approveInstructor(instructorId) {
  const instructor = await prisma.user.findUnique({ where: { id: instructorId } });

  if (!instructor || instructor.role !== "INSTRUCTOR") {
    throw AppError.NotFound("Instructor not found");
  }

  const updatedInstructor = await prisma.user.update({
    where: { id: instructorId },
    data: { status: "ACTIVE" },
  });

  return sanitizeUser(updatedInstructor);
}

async function rejectInstructor(instructorId) {
  const instructor = await prisma.user.findUnique({ where: { id: instructorId } });

  if (!instructor || instructor.role !== "INSTRUCTOR") {
    throw AppError.NotFound("Instructor not found");
  }

  const updatedInstructor = await prisma.user.update({
    where: { id: instructorId },
    data: { status: "REJECTED" },
  });

  return sanitizeUser(updatedInstructor);
}

async function removeInstructor(instructorId) {
  const instructor = await prisma.user.findUnique({ where: { id: instructorId } });

  if (!instructor || instructor.role !== "INSTRUCTOR") {
    throw AppError.NotFound("Instructor not found");
  }

  const updatedInstructor = await prisma.user.update({
    where: { id: instructorId },
    data: { status: "SUSPENDED" },
  });

  return sanitizeUser(updatedInstructor);
}

async function listStudents() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
  });

  return students.map(sanitizeUser);
}

async function suspendStudent(studentId) {
  const student = await prisma.user.findUnique({ where: { id: studentId } });

  if (!student || student.role !== "STUDENT") {
    throw AppError.NotFound("Student not found");
  }

  const updatedStudent = await prisma.user.update({
    where: { id: studentId },
    data: { status: "SUSPENDED" },
  });

  return sanitizeUser(updatedStudent);
}

async function removeStudent(studentId) {
  const student = await prisma.user.findUnique({ where: { id: studentId } });

  if (!student || student.role !== "STUDENT") {
    throw AppError.NotFound("Student not found");
  }

  const updatedStudent = await prisma.user.update({
    where: { id: studentId },
    data: { status: "SUSPENDED" },
  });

  return sanitizeUser(updatedStudent);
}

async function getInstructorPublicProfile(instructorId) {
  const instructor = await prisma.user.findUnique({
    where: { id: instructorId },
    include: { instructorProfile: true },
  });

  if (!instructor || instructor.role !== "INSTRUCTOR") {
    throw AppError.NotFound("Instructor not found");
  }

  return sanitizeInstructorProfile(instructor);
}

async function updateOwnInstructorProfile(userId, input) {
  const updatedProfile = await prisma.instructorProfile.upsert({
    where: { userId: userId },
    update: input,
    create: { userId: userId, ...input },
  });

  const instructor = await prisma.user.findUnique({
    where: { id: userId },
    include: { instructorProfile: true },
  });

  return sanitizeInstructorProfile(instructor);
}

module.exports = {
  listInstructors,
  approveInstructor,
  rejectInstructor,
  removeInstructor,
  listStudents,
  suspendStudent,
  removeStudent,
  getInstructorPublicProfile,
  updateOwnInstructorProfile,
};
