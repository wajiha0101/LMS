const { sendSuccess } = require("../../utils/ApiResponse");
const {
  listUsers,
  approveUser,
  rejectUser,
  removeUser,
  getOwnProfile,
  getUserById,
  updateOwnProfile,
} = require("./users.service");

async function listUsersController(req, res, next) {
  try {
    const users = await listUsers(req.query);
    sendSuccess(res, users);
  } catch (error) {
    next(error);
  }
}

async function approveUserController(req, res, next) {
  try {
    const user = await approveUser(req.params.id);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

async function rejectUserController(req, res, next) {
  try {
    const user = await rejectUser(req.params.id);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

async function removeUserController(req, res, next) {
  try {
    const user = await removeUser(req.params.id);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

async function getOwnProfileController(req, res, next) {
  try {
    const user = await getOwnProfile(req.user.id, req.user);
    sendSuccess(res, user);
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

async function updateOwnProfileController(req, res, next) {
  try {
    const user = await updateOwnProfile(req.user.id, req.user.role, req.body);
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listUsersController,
  approveUserController,
  rejectUserController,
  removeUserController,
  getOwnProfileController,
  getUserByIdController,
  updateOwnProfileController,
};
