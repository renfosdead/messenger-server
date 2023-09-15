const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/chat.controller");

router.get("/get", async (req, res) => {
  await ChatController.getFullChat(req)
    .then((chat) => res.json(chat))
    .catch((err) => {
      console.log(err);
      return res.json(err);
    });
});

router.delete("/clear", async (req, res) => {
  await ChatController.clearFullChat(req)
    .then((chat) => res.json(chat))
    .catch((err) => {
      console.log(err);
      return res.json(err);
    });
});

module.exports = router;
