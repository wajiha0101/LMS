const analyticsRepository = require("./analytics.repository");

async function getAdminAnalytics() {
  const [totals, trends] = await Promise.all([
    analyticsRepository.getPlatformTotals(),
    analyticsRepository.getEnrollmentTrends(),
  ]);
  return { ...totals, enrollmentTrends: trends };
}

async function getInstructorAnalytics(instructorId) {
  return analyticsRepository.getInstructorTotals(instructorId);
}

module.exports = { getAdminAnalytics, getInstructorAnalytics };