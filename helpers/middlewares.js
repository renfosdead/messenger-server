function mustBeString(req, res, next) {
  const id = req.params.id;
  if (!String.isString(id)) {
    res.status(400).json({ message: "ID must be a string" });
  } else {
    next();
  }
}

module.exports = {
  mustBeString,
};
