function SendSuccess(res, Data, StatusCode = 200, Meta = undefined) {
  const Envelope = {
    success: true,
    data: Data,
  };

  if (Meta) {
    Envelope.meta = Meta;
  }

  return res.status(StatusCode).json(Envelope);
}

module.exports = { SendSuccess };
