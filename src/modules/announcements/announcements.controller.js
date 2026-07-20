const announcementsService = require("./announcements.service");

async function createAnnouncement(req, res, next) {
  try {
    const { title, message } = req.body;
    const announcement = await announcementsService.createAnnouncement(
      req.user.id,
      req.params.id,
      title,
      message
    );
    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    next(err);
  }
}

async function getAnnouncements(req, res, next) {
  try {
    const announcements = await announcementsService.getAnnouncements(req.user, req.params.id);
    res.json({ success: true, data: announcements });
  } catch (err) {
    next(err);
  }
}

module.exports = { createAnnouncement, getAnnouncements };