const express = require("express");
const router = express.Router();
const user = require("../models/user.model");

router.post("/login", async (req, res) => {
  await user.login(req.body).then((payload) => res.json(payload));
});

router.get("/logout", async (req, res) => {
  await user
    .logout(req.headers.chatid, req.headers.userid)
    .then((payload) => res.json(payload));
});

router.post("/name", async (req, res) => {
  await user
    .changeName(req.headers.chatid, req.headers.userid, req.body)
    .then((payload) => res.json(payload));
});

router.post("/change_status", async (req, res) => {
  await user
    .changeStatus(req.headers.chatid, req.headers.userid, req.body)
    .then((payload) => res.json(payload));
});

router.post("/change_custom_status", async (req, res) => {
  await user
    .changeCustomStatus(req.headers.chatid, req.headers.userid, req.body)
    .then((payload) => res.json(payload));
});

router.post("/message", async (req, res) => {
  await user
    .sendMessage(req.headers.chatid, req.headers.userid, req.body)
    .then((payload) => res.json(payload));
});

module.exports = router;
