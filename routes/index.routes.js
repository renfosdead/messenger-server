const express = require("express");
const router = express.Router();
module.exports = router;
router.use("/chat", require("./chat.routes"));
router.use("/user", require("./user.routes"));
router.use("/events", require("./events.routes"));
