const { sendSuccess } = require("../../utils/ApiResponse");
const {
  listInstructors,
  approveInstructor,
  rejectInstructor,
  removeInstructor,
  listStudents,
  suspendStudent,
  removeStudent,
  getInstructorPublicProfile,
  getUserById,
  updateOwnInstructorProfile,
} = require("./users.service");

async function listInstructorsController(_req, res, next) {
  try {
    const instructors = await listInstructors();
    sendSuccess(res, instructors);
  } catch (error) {
    next(error);
  }
}

async function approveInstructorController(req, res, next) {
  try {
    const instructor = await approveInstructor(req.params.id);
    sendSuccess(res, instructor);
  } catch (error) {
    next(error);
  }
}

async function rejectInstructorController(req, res, next) {
  try {
    const instructor = await rejectInstructor(req.params.id);
    sendSuccess(res, instructor);
  } catch (error) {
    next(error);
  }
}

async function removeInstructorController(req, res, next) {
  try {
    const instructor = await removeInstructor(req.params.id);
    sendSuccess(res, instructor);
  } catch (error) {
    next(error);
  }
}

async function listStudentsController(_req, res, next) {
  try {
    const students = await listStudents();
    sendSuccess(res, students);
  } catch (error) {
    next(error);
  }
}

async function suspendStudentController(req, res, next) {
  try {
    const student = await suspendStudent(req.params.id);
    sendSuccess(res, student);
  } catch (error) {
    next(error);
  }
}

async function removeStudentController(req, res, next) {
  try {
    const student = await removeStudent(req.params.id);
    sendSuccess(res, student);
  } catch (error) {
    next(error);
  }
}

async function getInstructorPublicProfileController(req, res, next) {
  try {
    const instructor = await getInstructorPublicProfile(req.params.id);
    sendSuccess(res, instructor);
  } catch (error) {
    next(error);
  }
}

async function getUserByIdController(req, res, next) {
  try {
    const user = await getUserById(req.params.id, req.user);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

async function updateOwnInstructorProfileController(req, res, next) {
  try {
    const instructor = await updateOwnInstructorProfile(req.user.id, req.body);
    sendSuccess(res, instructor);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listInstructorsController,
  approveInstructorController,
  rejectInstructorController,
  removeInstructorController,
  listStudentsController,
  suspendStudentController,
  removeStudentController,
  getInstructorPublicProfileController,
  getUserByIdController,
  updateOwnInstructorProfileController,
};
