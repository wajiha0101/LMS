const enrollmentsService = require("./enrollments.service");

async function getMyEnrollments(req, res, next) {
  try {
    const studentId = req.user.id;
    const enrollments = await enrollmentsService.getMyEnrollments(studentId);
    res.json({ success: true, data: enrollments });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyEnrollments };