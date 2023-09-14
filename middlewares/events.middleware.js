function isCorrectFieldsMessage(req, res, next) {
  const { message } = req.body;
  if (message && typeof message === "string") {
    next();
  } else {
    res.status(400).json({ error: "Wrong data" });
  }
}

exports.isCorrectFieldsMessage = isCorrectFieldsMessage;
