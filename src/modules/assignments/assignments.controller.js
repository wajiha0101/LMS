const { sendSuccess } = require("../../utils/ApiResponse");
const {
  createAssignment,
  updateAssignment,
  submitAssignment,
  gradeSubmission,
} = require("./assignments.service");

async function createAssignmentController(req, res, next) {
  try {
    const assignment = await createAssignment(req.params.id, req.user.id, req.body);
    sendSuccess(res, assignment, 201);
  } catch (error) {
    next(error);
  }
}

async function updateAssignmentController(req, res, next) {
  try {
    const assignment = await updateAssignment(req.params.id, req.user.id, req.body);
    sendSuccess(res, assignment);
  } catch (error) {
    next(error);
  }
}

async function submitAssignmentController(req, res, next) {
  try {
    const submission = await submitAssignment(req.params.id, req.user.id, req.body);
    sendSuccess(res, submission, 201);
  } catch (error) {
    next(error);
  }
}

async function gradeSubmissionController(req, res, next) {
  try {
    const submission = await gradeSubmission(req.params.id, req.user.id, req.body);
    sendSuccess(res, submission);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAssignmentController,
  updateAssignmentController,
  submitAssignmentController,
  gradeSubmissionController,
};
