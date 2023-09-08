const express = require("express");
const router = express.Router();
const chat = require("../models/chat.model");
const m = require("../helpers/middlewares");
const EVENT_TYPES = require("../messenger-types/src/event_types");

router.get("/", async (req, res) => {
  await chat
    .getEvents(req.headers.chatid, req.headers.userid)
    .then((events) => {
      if (!events.error) {
        chat.deleteEvents(
          (events || [])
            .filter((e) => e.type !== EVENT_TYPES.sendMessage)
            .map((e) => e.id)
        );
      }
      return res.json(events);
    });
});

module.exports = router;
