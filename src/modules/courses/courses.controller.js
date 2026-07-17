const { sendSuccess } = require("../../utils/ApiResponse");
const {
  listCategories,
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
  submitCourseForApproval,
  listCoursesForAdmin,
  approveCourse,
  rejectCourse,
} = require("./courses.service");

async function listCategoriesController(_req, res, next) {
  try {
    const categories = await listCategories();
    sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
}

async function listCoursesController(req, res, next) {
  try {
    const result = await listCourses(req.query);
    sendSuccess(res, result.courses, 200, result.meta);
  } catch (error) {
    next(error);
  }
}

async function getCourseByIdController(req, res, next) {
  try {
    const course = await getCourseById(req.params.id);
    sendSuccess(res, course);
  } catch (error) {
    next(error);
  }
}

async function createCourseController(req, res, next) {
  try {
    const course = await createCourse(req.user.id, req.body);
    sendSuccess(res, course, 201);
  } catch (error) {
    next(error);
  }
}

async function updateCourseController(req, res, next) {
  try {
    const course = await updateCourse(req.params.id, req.user.id, req.body);
    sendSuccess(res, course);
  } catch (error) {
    next(error);
  }
}

async function deleteCourseController(req, res, next) {
  try {
    await deleteCourse(req.params.id, req.user);
    sendSuccess(res, { message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function getCourseStudentsController(req, res, next) {
  try {
    const students = await getCourseStudents(req.params.id, req.user.id);
    sendSuccess(res, students);
  } catch (error) {
    next(error);
  }
}

async function submitCourseForApprovalController(req, res, next) {
  try {
    const course = await submitCourseForApproval(req.params.id, req.user.id);
    sendSuccess(res, course);
  } catch (error) {
    next(error);
  }
}

async function listCoursesForAdminController(req, res, next) {
  try {
    const result = await listCoursesForAdmin(req.query);
    sendSuccess(res, result.courses, 200, result.meta);
  } catch (error) {
    next(error);
  }
}

async function approveCourseController(req, res, next) {
  try {
    const course = await approveCourse(req.params.id, req.user.id);
    sendSuccess(res, course);
  } catch (error) {
    next(error);
  }
}

async function rejectCourseController(req, res, next) {
  try {
    const course = await rejectCourse(req.params.id, req.user.id, req.body?.notes);
    sendSuccess(res, course);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCategoriesController,
  listCoursesController,
  getCourseByIdController,
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getCourseStudentsController,
  submitCourseForApprovalController,
  listCoursesForAdminController,
  approveCourseController,
  rejectCourseController,
};
