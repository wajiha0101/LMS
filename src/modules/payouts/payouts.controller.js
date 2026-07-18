const { sendSuccess } = require("../../utils/ApiResponse");
const { listOwnPayouts, listAllPayouts } = require("./payouts.service");

async function listOwnPayoutsController(req, res, next) {
  try {
    const payouts = await listOwnPayouts(req.user.id);
    sendSuccess(res, payouts);
  } catch (error) {
    next(error);
  }
}

async function listAllPayoutsController(_req, res, next) {
  try {
    const payouts = await listAllPayouts();
    sendSuccess(res, payouts);
  } catch (error) {
    next(error);
  }
}

module.exports = { listOwnPayoutsController, listAllPayoutsController };
