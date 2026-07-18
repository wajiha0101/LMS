const { sendSuccess } = require("../../utils/ApiResponse");
const { createReview, listReviews } = require("./reviews.service");

async function createReviewController(req, res, next) {
  try {
    const review = await createReview(req.params.id, req.user.id, req.body);
    sendSuccess(res, review, 201);
  } catch (error) {
    next(error);
  }
}

async function listReviewsController(req, res, next) {
  try {
    const reviews = await listReviews(req.params.id);
    sendSuccess(res, reviews);
  } catch (error) {
    next(error);
  }
}

module.exports = { createReviewController, listReviewsController };
