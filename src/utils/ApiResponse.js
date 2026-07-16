function sendSuccess(res, data, statusCode = 200, meta = undefined) {
  const envelope = {
    success: true,
    data: data,
  };

  if (meta) {
    envelope.meta = meta;
  }

  return res.status(statusCode).json(envelope);
}

module.exports = { sendSuccess };
