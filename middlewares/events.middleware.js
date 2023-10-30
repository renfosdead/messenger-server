function isCorrectFieldsMessage(req, res, next) {
  const { message } = req.body;
  if (message && typeof message === "string") {
    next();
  } else {
    res.status(400).json({ error: "Wrong data" });
  }
}

function isCorrectFieldsImage(req, res, next) {
  const { image } = req.body;

  if (image && typeof image === "string") {
    next();
  } else {
    res.status(400).json({ error: "Wrong data" });
  }
}

exports.isCorrectFieldsMessage = isCorrectFieldsMessage;
exports.isCorrectFieldsImage = isCorrectFieldsImage;
