const express = require("express");
const router = express.Router();
const EventsController = require("../controllers/events.controller");
const EventsMiddleware = require("../middlewares/events.middleware");

router.get("/", async (req, res) => {
  await EventsController.getEvents(req)
    .then((events) => res.json(events))
    .catch((err) => {
      console.log(err);
      return res.json(err);
    });
});

router.post(
  "/message",
  EventsMiddleware.isCorrectFieldsMessage,
  async (req, res) => {
    EventsController.sendMessage(req)
      .then((payload) => res.json(payload))
      .catch((err) => {
        console.log(err);
        return res.json(err);
      });
  }
);

module.exports = router;
