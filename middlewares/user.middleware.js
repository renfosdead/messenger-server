const DataHelper = require("../helpers/data");

function isCorrectLoginFields(req, res, next) {
  const { name, status, customStatus } = req.body;
  if (
    name &&
    status &&
    customStatus &&
    DataHelper.isCorrectStatus(status) &&
    DataHelper.isCorrectCustomStatus(customStatus)
  ) {
    next();
  } else {
    res.status(400).json({ error: "Wrong data" });
  }
}

function isCorrectStatusFields(req, res, next) {
  const { status } = req.body;
  if (status && DataHelper.isCorrectStatus(status)) {
    next();
  } else {
    res.status(400).json({ error: "Wrong data" });
  }
}

function isCorrectCustomStatusFields(req, res, next) {
  const { customStatus } = req.body;
  if (customStatus && DataHelper.isCorrectCustomStatus(customStatus)) {
    next();
  } else {
    res.status(400).json({ error: "Wrong data" });
  }
}

function isCorrectNameFields(req, res, next) {
  const { name } = req.body;
  if (name && typeof name === "string") {
    next();
  } else {
    res.status(400).json({ error: "Wrong data" });
  }
}

exports.isCorrectLoginFields = isCorrectLoginFields;
exports.isCorrectStatusFields = isCorrectStatusFields;
exports.isCorrectCustomStatusFields = isCorrectCustomStatusFields;
exports.isCorrectNameFields = isCorrectNameFields;
