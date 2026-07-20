const forumService = require("./forum.service");

async function getThreads(req, res, next) {
  try {
    const threads = await forumService.getThreads(req.user, req.params.id);
    res.json({ success: true, data: threads });
  } catch (err) {
    next(err);
  }
}

async function createThread(req, res, next) {
  try {
    const thread = await forumService.createThread(req.user, req.params.id, req.body.title);
    res.status(201).json({ success: true, data: thread });
  } catch (err) {
    next(err);
  }
}

async function getThread(req, res, next) {
  try {
    const result = await forumService.getThreadWithPosts(req.user, req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function addPost(req, res, next) {
  try {
    const post = await forumService.addPost(req.user, req.params.id, req.body.message);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

module.exports = { getThreads, createThread, getThread, addPost };