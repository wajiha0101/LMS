const cartService = require("./cart.service");

async function getCart(req, res, next) {
  try {
    const studentId = req.user.id; // matches her auth.middleware.js (req.user.id, not .sub)
    const { items, total } = await cartService.getCart(studentId);
    res.json({ success: true, data: { items, total } });
  } catch (err) {
    next(err);
  }
}

async function addItem(req, res, next) {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;
    const item = await cartService.addItem(studentId, courseId);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const studentId = req.user.id;
    await cartService.removeItem(studentId, req.params.id);
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, removeItem };