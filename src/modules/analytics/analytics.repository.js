const { prisma } = require("../../lib/prisma");

async function getPlatformTotals() {
  const [totalUsers, totalStudents, totalInstructors, totalCourses, revenueAgg, totalEnrollments] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      prisma.course.count(),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCEEDED" } }),
      prisma.enrollment.count(),
    ]);

  return {
    totalUsers,
    totalStudents,
    totalInstructors,
    totalCourses,
    totalRevenue: revenueAgg._sum.amount ?? 0,
    totalEnrollments,
  };
}

async function getEnrollmentTrends() {
  return prisma.$queryRaw`
    SELECT DATE("enrolledAt") as date, COUNT(*)::int as count
    FROM "Enrollment"
    WHERE "enrolledAt" >= NOW() - INTERVAL '30 days'
    GROUP BY DATE("enrolledAt")
    ORDER BY date ASC
  `;
}

async function getInstructorTotals(instructorId) {
  const courses = await prisma.course.findMany({
    where: { instructorId },
    select: { id: true, title: true },
  });
  const courseIds = courses.map((c) => c.id);

  const [revenueAgg, totalEnrollments, avgRatingAgg] = await Promise.all([
    prisma.payment.aggregate({
      _sum: { amount: true, commissionAmount: true },
      where: { courseId: { in: courseIds }, status: "SUCCEEDED" },
    }),
    prisma.enrollment.count({ where: { courseId: { in: courseIds } } }),
    prisma.review.aggregate({
      _avg: { rating: true },
      where: { courseId: { in: courseIds } },
    }),
  ]);

  const grossRevenue = Number(revenueAgg._sum.amount ?? 0);
  const commission = Number(revenueAgg._sum.commissionAmount ?? 0);

  return {
    totalCourses: courses.length,
    totalEnrollments,
    grossRevenue,
    netRevenue: grossRevenue - commission,
    averageRating: avgRatingAgg._avg.rating ?? null,
  };
}

module.exports = { getPlatformTotals, getEnrollmentTrends, getInstructorTotals };