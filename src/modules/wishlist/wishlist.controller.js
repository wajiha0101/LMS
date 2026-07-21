const wishlistService = require("./wishlist.service");

async function getWishlist(req, res, next) {
  try {
    const items = await wishlistService.getWishlist(req.user.id);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

async function addToWishlist(req, res, next) {
  try {
    const item = await wishlistService.addToWishlist(req.user.id, req.params.courseId);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

async function removeFromWishlist(req, res, next) {
  try {
    await wishlistService.removeFromWishlist(req.user.id, req.params.courseId);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist };