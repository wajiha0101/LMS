const analyticsService = require("./analytics.service");

async function getAdminAnalytics(req, res, next) {
  try {
    const data = await analyticsService.getAdminAnalytics();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getInstructorAnalytics(req, res, next) {
  try {
    const data = await analyticsService.getInstructorAnalytics(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAdminAnalytics, getInstructorAnalytics };