const { prisma } = require("../../lib/prisma");
const { uploadBuffer } = require("../../lib/cloudinary");
const { generateCertificatePdf } = require("./certificates.pdf");
const { AppError } = require("../../utils/AppError");

function sanitizeCertificate(certificate) {
  return {
    id: certificate.id,
    studentId: certificate.studentId,
    courseId: certificate.courseId,
    certificateUrl: certificate.certificateUrl,
    issuedAt: certificate.issuedAt,
  };
}

async function listCertificates(studentId) {
  const certificates = await prisma.certificate.findMany({
    where: { studentId: studentId },
    orderBy: { issuedAt: "desc" },
  });

  return certificates.map(sanitizeCertificate);
}

async function getCourseCertificate(courseId, studentId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw AppError.NotFound("Course not found");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { courseId: courseId, studentId: studentId },
  });

  if (!enrollment || enrollment.status !== "COMPLETED") {
    throw AppError.Forbidden("You must complete this course to receive a certificate");
  }

  const existingCertificate = await prisma.certificate.findUnique({
    where: { studentId_courseId: { studentId: studentId, courseId: courseId } },
  });

  if (existingCertificate) {
    return sanitizeCertificate(existingCertificate);
  }

  const student = await prisma.user.findUnique({ where: { id: studentId } });

  const issueDate = new Date();
  const pdfBuffer = await generateCertificatePdf(student.name, course.title, issueDate);
  const uploadResult = await uploadBuffer(pdfBuffer, { resource_type: "raw" });

  const createdCertificate = await prisma.certificate.create({
    data: {
      studentId: studentId,
      courseId: courseId,
      certificateUrl: uploadResult.secure_url,
      issuedAt: issueDate,
    },
  });

  return sanitizeCertificate(createdCertificate);
}

module.exports = { listCertificates, getCourseCertificate };
