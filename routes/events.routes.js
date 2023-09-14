const express = require("express");
const router = express.Router();
const EventsController = require("../controllers/events.controller");
const EventsMiddleware = require("../middlewares/events.middleware");

router.get("/", async (req, res) => {
  EventsController.getEvents(req)
    .then((res) => res.json(events))
    .catch((err) => res.json(err));
});

router.post(
  "/message",
  EventsMiddleware.isCorrectFieldsMessage,
  async (req, res) => {
    EventsController.sendMessage(req)
      .then((payload) => res.json(payload))
      .catch((err) => res.json(err));
  }
);

module.exports = router;
