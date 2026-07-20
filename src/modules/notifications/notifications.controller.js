const notificationsService = require("./notifications.service");

async function getMyNotifications(req, res, next) {
  try {
    const items = await notificationsService.getMyNotifications(req.user.id);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const notification = await notificationsService.markAsRead(req.user.id, req.params.id);
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyNotifications, markAsRead };