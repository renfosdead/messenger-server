const express = require("express");
const router = express.Router();
const chat = require("../models/chat.model");
const m = require("../helpers/middlewares");

router.get("/", async (req, res) => {
  await chat.getEvents().then((events) => res.json(events));
});

module.exports = router;
